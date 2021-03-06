'use strict'

const transactioRepository = require('../repositories/transactionRepository')
const accountRepository = require('../repositories/accountRepository')
const userAgentService = require('../services/userAgentService');

module.exports = {

    // async é vida hahaha
    async store(req, res, next) {
        try {
            let accountA = await accountRepository.getByAccountNumber(req.body.accountNumber);
            let accountB = await accountRepository.getByAccountNumber(req.body.targetAccountNumber);
            if (accountA != null && accountB != null) {
                //Deposito
                if (req.body.transactionType == 0) {
                    let newBalance = parseFloat(accountA.balance) + parseFloat(req.body.amount);
                    let transaction = {
                        type: "deposit",
                        accountId: accountA._id,
                        accountNumber: req.body.accountNumber,
                        interactedAccountId: accountA._id,
                        postBalance: newBalance,
                        amount: parseFloat(req.body.amount),
                        ip: userAgentService.getIpCustomer(req),
                        userAgent: userAgentService.getUserAgent(req),
                        description: ("Deposito por envelope")
                    };
                    await transactioRepository.create(transaction);

                    await accountRepository.updateBalance(accountA.accountNumber, parseFloat(req.body.amount), userAgentService.getUserAgent(req), userAgentService.getIpCustomer(req));
                //Transferencia
                } else if (req.body.transactionType == 1) {
                    let postBalanceA =  parseFloat(accountA.balance) + (parseFloat(req.body.amount) * -1);
                    let postBalanceB =  parseFloat(accountB.balance) + (parseFloat(req.body.amount));
                    await transactioRepository.create({
                        type: "transfer",
                        accountId: accountA._id,
                        accountNumber: req.body.accountNumber,
                        interactedAccountId: accountB._id,
                        postBalance: postBalanceA,
                        amount: (req.body.amount * -1),
                        ip: userAgentService.getIpCustomer(req),
                        userAgent: userAgentService.getUserAgent(req),
                        description: ("Transferencia Bancaria: Envio")
                    });
                    await transactioRepository.create({
                        type: "transfer",
                        accountId: accountB._id,
                        accountNumber: req.body.targetAccountNumber,
                        interactedAccountId: accountA._id,
                        postBalance: postBalanceB,
                        amount: (req.body.amount),
                        ip: userAgentService.getIpCustomer(req),
                        userAgent: userAgentService.getUserAgent(req),
                        description: ("Transferencia Bancaria: Recebimento")
                    });
                    await accountRepository.updateBalance(accountA.accountNumber, (parseFloat(req.body.amount) * -1), userAgentService.getUserAgent(req), userAgentService.getIpCustomer(req));
                    await accountRepository.updateBalance(accountB.accountNumber, (parseFloat(req.body.amount)), userAgentService.getUserAgent(req), userAgentService.getIpCustomer(req));
                }
                // Saque
                else if (req.body.transactionType == 3) {
                    let postBalanceA =  parseFloat(accountA.balance) + (parseFloat(req.body.amount) * -1);
                    await transactioRepository.create({
                        type: "transfer",
                        accountId: accountA._id,
                        accountNumber: req.body.accountNumber,
                        interactedAccountId: accountA._id,
                        postBalance: postBalanceA,
                        amount: (req.body.amount * -1),
                        ip: userAgentService.getIpCustomer(req),
                        userAgent: userAgentService.getUserAgent(req),
                        description: ("Saque no caixa eletronico")
                    });
                    await accountRepository.updateBalance(accountA.accountNumber, (parseFloat(req.body.amount) * -1), userAgentService.getUserAgent(req), userAgentService.getIpCustomer(req));
                }
                // Saque
                else if (req.body.transactionType == 4) {
                    let postBalanceA =  parseFloat(accountA.balance) + (parseFloat(req.body.amount) * -1);
                    await transactioRepository.create({
                        type: "debt",
                        accountId: accountA._id,
                        accountNumber: accountA.accountNumber,
                        interactedAccountId: accountA._id,
                        postBalance: postBalanceA,
                        amount: (req.body.amount * -1),
                        ip: userAgentService.getIpCustomer(req),
                        userAgent: userAgentService.getUserAgent(req),
                        description: ("Uso de cartão na função débito")
                    });
                    await accountRepository.updateBalance(accountA.accountNumber, (parseFloat(req.body.amount) * -1), userAgentService.getUserAgent(req), userAgentService.getIpCustomer(req));
                }
                return res.status(201).json({
                    sucess: true,
                    message: 'transaction sucessfull',
                    data: req.body
                });
            }

        } catch (e) {
            return res.status(500).json({
                sucess: false,
                message: e
            });
        }
    }
}