const express = require("express");
const EmpModel = require("../models/emp.model");

const empRouter = express.Router();

// to get the details of employee
empRouter.get("/employees", async (req, res) => {
  const { firstName, lastName, email, department, salary, sort, limit, page } =
    req.query;
  try {
    let query = {};

    // to check which query is being used

    if (firstName) {
      query.firstName = RegExp(firstName, "i");
    }

    if (lastName) {
      query.lastName = RegExp(lastName, "i");
    }

    if (email) {
      query.email = RegExp(email, "i");
    }

    if (department) {
      query.department = RegExp(department, "i");
    }

    if (salary) {
      query.salary = RegExp(salary, "i");
    }

    // to sort the data basis on salary fields
    let sortBy = {};

    if (sort) {
      sortBy["salary"] = sort === "asc" ? 1 : "desc" ? -1 : "" || 1;
    }

    // for pagination
    const pageNumber = page || 1;
    const pageLimit = limit || 5;

    const pagination = pageNumber * pageLimit - pageLimit || 0;

    const emp = await EmpModel.find(query)
      .sort(sortBy)
      .skip(pagination)
      .limit(pageLimit);
    res.status(200).send({ data: emp });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

// create -- will add the employee data in db
empRouter.post("/employees", async (req, res) => {
  const payload = req.body;
  try {
    const empData = new EmpModel(payload);
    await empData.save();
    res.status(200).send({ data: empData, msg: "Employee has been added" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

//  to update the employee details
empRouter.patch("/employees/:id", async (req, res) => {
  const { id } = req.params;
  const payload = req.body;
  try {
    const emp = await EmpModel.findByIdAndUpdate({ _id: id }, payload);
    res.status(200).send({ msg: "Employee data has been updated" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

//  to delete the employee details
empRouter.delete("/employees/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await EmpModel.findByIdAndDelete({ _id: id });
    res.status(200).send({ msg: "Employee data has been deleted" });
  } catch (err) {
    res.status(400).send({ msg: err.message });
  }
});

module.exports = empRouter;
