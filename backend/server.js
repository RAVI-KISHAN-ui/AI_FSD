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
          res.end(JSON.stringify({ message: "Error writing file" }));
        } else {
          res.writeHead(201, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Employee added successfully" }));
        }
      });
    });

  } catch (error) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Invalid JSON format" }));
  }
});

