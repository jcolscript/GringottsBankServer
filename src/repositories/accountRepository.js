const mongoose= require('mongoose');
const AccountModel = mongoose.model('Account');

exports.createAccount = async (data) => {
    var account = new AccountModel(data);
    const accountNumber = await account.save();
    console.log('sa');
    return accountNumber;
}

exports.getById = async (id) => {
    const res = await AccountModel.findOne({"customerId":id},{ "_id": 0, "balance": 1, "accountNumber": 1, "contacts": 1});
    return res;
}

exports.generateAccountNumber = async () => {
    const lastAccountNumber = await AccountModel.findOne({},{}, {sort: {'accountNumber': -1}});
    const nenewAccountNumber = undefined;
    if(lastAccountNumber == null){
        newAccountNumber = 10000;
    }else{
        newAccountNumber = lastAccountNumber.accountNumber + 1;
    }  
    console.log(newAccountNumber);

    return newAccountNumber;
}

exports.updateBalance = async(id, amount, agent, ip) => {
    const res = await AccountModel.findById(id);
    res.balance += amount;

    res = await AccountModel.update(
        { _id: id }, 
        { $set: 
            {
                balance: res.balance, 
                lastIp: ip, 
                lastUserAgent: agent
            }
        }
    );
    
    return res;
}