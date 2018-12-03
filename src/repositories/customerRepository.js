'use strict';
const mongoose = require('mongoose');
const CustomerModel = mongoose.model('Customer');

exports.create = async(data) => {
    var customer = new CustomerModel(data);
    await customer.save();
}

exports.authenticate = async(data) => {
    const res = await CustomerModel.findOne({
        cpf: data.cpf,
        password: data.password
    });
    return res;
}

exports.getById = async(id) => {
    const res = await CustomerModel.findById(id);
    return res;
}