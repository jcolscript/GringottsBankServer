'use sctrict'

const mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

const TransactionSchema = new mongoose.Schema({
	type: {
		type: String,
        enum: ['deposit','transfer','withdraw','debt'],
        required: true
    },
    accountId: {
        type: ObjectId,
        ref: 'Account',
        index: true,
        required: true
    },
    interactedAccountId:{
        type: ObjectId,
        ref: 'Account',
        index: true,
        required: true
    },
    postBalance: {
        type: Number,
        default: 0.00,
        required: true
    },
	amount: {
		type: Number,
        default: 0.00,
        required: true
	},
    ip:{
        type: String,
        default: "0.0.0.0",
        trim: true,
        required: true
    },
    userAgent:{
        type:String,
        trim: true,
        default: ""
    },
    transactionTime:{
        type: Date,
        default: Date.now,
        required: true,
    },
    description:{
        type: String,
        default: ""
    }
});

module.exports = mongoose.model("Transaction", TransactionSchema);