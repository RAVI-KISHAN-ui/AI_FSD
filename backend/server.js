const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 5000;

const filePath = path.join(__dirname, "backend", "data.json");

const server = http.createServer((req, res) => {

  // GET API
  if (req.method === "GET" && req.url === "/read") {
    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        return res.end(JSON.stringify({ message: "Error reading file" }));
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    });
  }

  // POST API
  else if (req.method === "POST" && req.url === "/write") {

    let body = "";

    req.on("data", chunk => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const newEmployee = JSON.parse(body);

        fs.readFile(filePath, "utf-8", (err, data) => {
          if (err) {
            res.writeHead(500, { "Content-Type": "application/json" });
            return res.end(JSON.stringify({ message: "Error reading file" }));
          }

          const employees = JSON.parse(data || "[]");
          employees.push(newEmployee);

          fs.writeFile(filePath, JSON.stringify(employees, null, 2), err => {
            if (err) {
              res.writeHead(500, { "Content-Type": "application/json" });
              return res.end(JSON.stringify({ message: "Error writing file" }));
            }

            res.writeHead(201, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Employee added successfully" }));
          });
        });

      } catch (error) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Invalid JSON format" }));
      }
    });
  }

  else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Route Not Found");
  }

});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
