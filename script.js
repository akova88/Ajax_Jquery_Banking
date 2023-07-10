/// <reference path="assets/jquery-3.7.0.min.js" />

const page = {
    url: {
        getAllCustomers: App.API_CUSTOMER + "?deleted=0",
        getCustomerById: App.API_CUSTOMER,
        createCustomer: App.API_CUSTOMER,
        updateCustomer: App.API_CUSTOMER,
        incrementBalance: App.API_CUSTOMER,
        deposit: App.API_DEPOSIT
    },
    elements: {

    },
    loadData: {

    },
    commands: {},
    dialogs: {
        elements: {},
        commands: {}
    },
    initializeControlEvent: {}
}



// class Customer {
//     constructor(fullName, email, phone, address, balance, deleted) {
//         this.fullName = fullName;
//         this.email = email;
//         this.phone = phone;
//         this.address = address;
//         this.balance = balance;
//         this.deleted = deleted;
//     }
// }

page.elements.btnShowCreateModal = $('#btnCreateShowModal');
page.elements.tbCustomerBody = $('#tbCustomer tbody');

page.dialogs.elements.modalCreate = $('#modalCreate');
page.dialogs.elements.fullNameCre = $('#fullNameCre');
page.dialogs.elements.emailCre = $('#emailCre');
page.dialogs.elements.phoneCre = $('#phoneCre');
page.dialogs.elements.addressCre = $('#addressCre');
page.dialogs.elements.btnCreate = $('#btnCreate');

page.dialogs.elements.modalUpdate = $('#modalUpdate');
page.dialogs.elements.fullNameUp = $('#fullNameUp');
page.dialogs.elements.emailUp = $('#emailUp');
page.dialogs.elements.phoneUp = $('#phoneUp');
page.dialogs.elements.addressUp = $('#addressUp');
page.dialogs.elements.btnUpdate = $('#btnUpdate');

page.dialogs.elements.modalDeposit = $('#modalDeposit');
page.dialogs.elements.idDeps = $('#idDeps');
page.dialogs.elements.fullNameDeps = $('#fullNameDeps');
page.dialogs.elements.balanceDeps = $('#balanceDeps');
page.dialogs.elements.transactionAmount = $('#transactionAmount');
page.dialogs.elements.btnSaveDeposit = $('#btnSaveDeposit');

let customerId = 0;
let customer = new Customer();
let deposit = new Deposit();


page.commands.renderCustomes = (obj) => {
    return `
        <tr id="tr_${obj.id}">
            <td class="text-center">${obj.id}</td>
            <td >${obj.fullName}</td>
            <td class="text-center">${obj.email}</td>
            <td class="text-center">${obj.phone}</td>
            <td >${obj.address}</td>
            <td class="text-end">${obj.balance}</td>
            <td>
                <button class="btn btn-outline-secondary edit" data-id="${obj.id}">
                    <i class="fas fa-pencil-alt"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-success deposit" data-id="${obj.id}">
                    <i class="fas fa-plus"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-warning withdraw" data-id="${obj.id}">
                    <i class="fas fa-minus"></i>
                </button>
            </td>
            <td>
                <button class="btn btn-outline-primary transfer" data-id="${obj.id}">
                    <i class="fas fa-exchange-alt"></i>
                </button>
            </td>   
            <td>
                <button class="btn btn-outline-danger delete" data-id="${obj.id}">
                    <i class="fas fa-trash"></i>
                </button>  
            </td>
        </tr>
    `;
}

page.commands.getAllCustomers = () => {

    page.elements.tbCustomerBody.empty();
    
    $.ajax({
        type: 'GET',
        url: page.url.getAllCustomers
    })
    .done((data) => {
        data.forEach(item => {
        const str = page.commands.renderCustomes(item);
        page.elements.tbCustomerBody.prepend(str);
        // handleAddAllEvent();
        });
    })
    .fail((error) => {
        console.log(error);
    })
}

// function handleAddAllEvent(){
//     handleAddEventShowUpdate();
//     handleAddEventShowDeposit();
//     handleAddEventShowWithdraw();
//     handleAddEventShowTransfer();
//     handleAddEventRemove()
// }

// bắt sự kiện nhấn vô nút create

page.dialogs.commands.create = () => {
    const fullName = page.dialogs.elements.fullNameCre.val();
    const email = page.dialogs.elements.emailCre.val();
    const phone = page.dialogs.elements.phoneCre.val();
    const address = page.dialogs.elements.addressCre.val();
    const balance = 0;
    const deleted = 0;

    const customer = new Customer(fullName, email, phone, address, balance, deleted);
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: page.url.createCustomer,
        data: JSON.stringify(customer)
    })
        .done((data) => {
            const str = page.commands.renderCustomes(data);
            
            page.elements.tbCustomerBody.prepend(str);
            page.dialogs.elements.fullNameCre.val("");
            page.dialogs.elements.emailCre.val("");
            page.dialogs.elements.phoneCre.val("");
            page.dialogs.elements.addressCre.val("");
            // handleAddAllEvent();
            page.dialogs.elements.modalCreate.modal('hide');
        })
        .fail((error) => {
            
        })
}


page.commands.getCustomerById = (id) => {
    return $.ajax ({
        type: 'GET',
        url: page.url.getCustomerById + '/' + id,
    });
    
}


// bắt sự kiện nhấn vô nút update
page.commands.handleAddEventShowModalUpdate = (customerId) =>{
    
      page.commands.getCustomerById(customerId).then((data) => {
        page.dialogs.elements.fullNameUp.val(data.fullName);
        page.dialogs.elements.emailUp.val(data.email);
        page.dialogs.elements.phoneUp.val(data.phone);
        page.dialogs.elements.addressUp.val(data.address);

      page.dialogs.elements.modalUpdate.modal('show');
      })
      .catch((error) => {
        console.log(error);
      })
}




page.dialogs.commands.update = (obj) => {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.url.updateCustomer + '/' + customerId,
        data: JSON.stringify(obj)
    })
        .done((data) => {
            const str = page.commands.renderCustomes(data);
            const currentRow = $('#tr_'+customerId);
            currentRow.replaceWith(str);
            App.showSuccessAlert("Update thành công!")
            page.dialogs.elements.modalUpdate.modal('hide');
            // handleAddAllEvent();
        })
        .fail((error) => {

        })
}

// bắt sự kiện nhấn vô nút Deposit
page.commands.handleAddEventShowModalDeposit = (customerId) => {
    page.commands.getCustomerById(customerId).then((data) => {
        customer = data;
        page.dialogs.elements.fullNameDeps.val(customer.fullName);
        page.dialogs.elements.idDeps.val(customer.id);
        page.dialogs.elements.balanceDeps.val(customer.balance);
        page.dialogs.elements.modalDeposit.modal('show');
    })
    .catch((error) => {
        console.log(error);
    })
}



page.dialogs.commands.deposit = (customer, deposit) => {
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: page.url.incrementBalance + '/' + customerId,
        data: JSON.stringify(customer)
    })
    .done((data) => {
        const strData = page.commands.renderCustomes(data);
        const currentRow = $('#tr_' + customerId);
        currentRow.replaceWith(strData);
        App.showSuccessAlert('Nạp tiền thành công!');
       
        page.dialogs.elements.transactionAmount.val('');
        page.dialogs.elements.balanceDeps.val(data.balance);
        page.dialogs.elements.modalDeposit.modal('hide');
        
        
        
    })
    .fail((error) => {
        console.log();
    })

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'POST',
            url: page.url.deposit,
            data: JSON.stringify(deposit)
        })
        .done((data) => {
            console.log(data);
        })
        .fail((error) => {
            console.log(error);
        })
}

// bắt sự kiện nhấn vô nút Withdraw
function handleAddEventShowWithdraw() {
    let btnWithdraw = $('.withdraw');
    btnWithdraw.off('click');
    btnWithdraw.on('click', function() {

        customerId = $(this).data('id');
    
        const modalWithdraw = $('#modalWithdraw');

        getCustomerById(customerId).then((data) => {
            customer = data;
                $('#fullNameWdr').val(customer.fullName);
                $('#idWdr').val(customer.id);
                $('#balanceWdr').val(customer.balance);
                modalWithdraw.modal('show');
            })
            .catch((error) => {
                console.log(error);
            })        
    })

    
}

// bắt sự kiện nhấn vô nút save WithDraw
const btnSaveWithdraw = $('#btnSaveWithdraw');
btnSaveWithdraw.off('click');
btnSaveWithdraw.on('click', () => {
    const currentBalance = customer.balance;
    const transactionAmountWdr = +$('#transactionAmountWdr').val();
    const newBalance = currentBalance - transactionAmountWdr;
    customer.balance = newBalance;
    const modalWithdraw = $('#modalWithdraw');

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3000/customers/'+ customerId,
        data: JSON.stringify(customer)
    })
    .done((data) => {
        const strData = page.commands.renderCustomes(data);
        const currentRow = $('#tr_' + customerId);
        currentRow.replaceWith(strData);
        handleAddAllEvent();
        $('#transactionAmountWdr').val('');
        $('#balanceWdr').val(data.balance);
        modalWithdraw.modal('hide');
        
        Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Rút tiền thành công!',
            showConfirmButton: false,
            timer: 1500
          })
    })
    .fail((error) => {
        console.log();
    })

        let withdraw = {
            customerId,
            transactionAmountWdr
        }
        console.log(withdraw);

        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'POST',
            url: 'http://localhost:3000/withdraws',
            data: JSON.stringify(withdraw)
        })
        .done((data) => {
            console.log(data);
        })
        .fail((error) => {
            console.log(error);
        })
})

// bắt sự kiện nhấn vô nút transfer
function handleAddEventShowTransfer(){
    let btnTransfer = $('.transfer');
    
    btnTransfer.off('click');
    btnTransfer.on('click', function() {

        customerId = $(this).data('id');
        const modalTransfer = $('#modalTransfer');

        getCustomerById(customerId).then((data) =>{
            sender = data;
            getAllRecipients(customerId);
            $('#idSender').val(sender.id);
            $('#fullNameSender').val(sender.fullName);
            $('#emailSender').val(sender.email);
            $('#balanceSender').val(sender.balance);

            modalTransfer.modal('show');
        })
        .catch((error) => {
            console.log(error);
        })
    })
}

//nhập input transferAmount

const iptransferMoney = $('#transferMoney');
iptransferMoney.on('input', calculateTotal);

function calculateTotal(){
    let amountNumber = parseFloat(iptransferMoney.val());
    $('#total').val(amountNumber*1.1);
}

function renderRecipientOption(obj){
    return `
        <option value="${obj.id}">(${obj.id}) - ${obj.fullName}</option>
    `;
}

function getAllRecipients(senderId) {
    $.ajax({
        type: 'GET',
        url: 'http://localhost:3000/customers?id_ne='+ senderId + '&deleted=0'
    })
    .done((data) => {
        $('#recipientTrf').empty();
        $.each(data, (i, item) => {
            let str = renderRecipientOption(item);
            $('#recipientTrf').append(str);
        })
    })
    .fail((error) => {
        console.log(error);
    })
}


// bắt sự kiến nhấn vô nút save transfer

const btnSaveTransfer = $('#btnSaveTransfer');
btnSaveTransfer.off('click');
btnSaveTransfer.on('click', () => {
    let senderId = customerId;
    let recipientId = +$('#recipientTrf').val();

    let transferAmount = +$('#transferMoney').val();
    let totalTransactionAmount = transferAmount*1.1;

    let senderBalance;
    let recipientBalance;
    getCustomerById(senderId).then((data) => {
        senderBalance = data.balance - totalTransactionAmount;
        let newSender = {
            balance: senderBalance
        }
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'PATCH',
            url: 'http://localhost:3000/customers/'+senderId,
            data: JSON.stringify(newSender)
        })
        .done((senderNew) => {
            let dataStr = page.commands.renderCustomes(senderNew);
            let currentRow = $('#tr_' + senderId);
            currentRow.replaceWith(dataStr);
            $('#balanceSender').val(senderBalance);
            handleAddAllEvent();
        })
    })
    .catch((error => {
        console.log(error);
    }))

    getCustomerById(recipientId).then((data) => {
        recipientBalance = data.balance + transferAmount;
        let newRecipient = {
            balance: recipientBalance
        }
        $.ajax({
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json'
            },
            type: 'PATCH',
            url: 'http://localhost:3000/customers/'+recipientId,
            data: JSON.stringify(newRecipient)
        })
        .done((recipientrNew) => {
            let dataStr = page.commands.renderCustomes(recipientrNew);
            let currentRow = $('#tr_' + recipientId);
            currentRow.replaceWith(dataStr);
            $('#transferMoney').val("");
            $('#total').val("");
            Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Chuyển tiền thành công!',
                showConfirmButton: false,
                timer: 1500
            })
            handleAddAllEvent();
            
        })
        .fail((error) => {
            console.log(error);
        })
    })
    .catch((error => {
        console.log(error);
    }))

    let transfer ={
        senderId,
        recipientId,
        transferAmount,
        transactionAmount: totalTransactionAmount,
        feesAmount: 10,
    }

    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: "POST",
        url: "http://localhost:3000/transfers",
        data: JSON.stringify(transfer)
    })
    .done((data) => {

    })
    .fail((error) => {
        
    })
})


//bắt sự kiện nhấn vô nút delete
function handleAddEventRemove(){
    const btnDelete = $('.delete');
    btnDelete.off('click');
    btnDelete.on('click', function() {
        let customerId = $(this).data('id');
        console.log(customerId);
        removeCustomer(customerId);
    })
}

function removeCustomer(id) {
    let customerDel = {
        deleted: 1
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) {
   
            $.ajax({
                headers: {
                    'accept': 'application/json',
                    'content-type': 'application/json'
                },
                type: "PATCH",
                url: "http://localhost:3000/customers/"+id,
                data: JSON.stringify(customerDel),
            })
            .done((data) => {

                Swal.fire(
                    'Deleted!',
                    'Your file has been deleted.',
                    'success'
                )

                let currentRow = $("#tr_" + id);
                console.log(currentRow);
                currentRow.remove();

            })
        }
      })
}

page.initializeControlEvent = () => {
    page.elements.btnShowCreateModal.on('click', () => {
        page.dialogs.elements.modalCreate.modal('show');
    })
    page.dialogs.elements.btnCreate.on('click', () => {
        page.dialogs.commands.create();
    })

    page.elements.tbCustomerBody.on('click','.edit', function() {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalUpdate(customerId);
    })
    page.elements.tbCustomerBody.on('click','.deposit', function() {
        customerId = $(this).data('id');
        page.commands.handleAddEventShowModalDeposit(customerId);
    })

    // bắt sự kiện nhấn vô nút save edit

    page.dialogs.elements.btnUpdate.on('click', () => {
        const fullName = page.dialogs.elements.fullNameUp.val();
        const email = page.dialogs.elements.emailUp.val();
        const phone = page.dialogs.elements.phoneUp.val();
        const address = page.dialogs.elements.addressUp.val();

        
        customer.fullName = fullName;
        customer.email = email;
        customer.phone = phone;
        customer.address = address;
        page.dialogs.commands.update(customer);
    })

    // bắt sự kiện nhấn vô nút save deposit
    page.dialogs.elements.btnSaveDeposit.on('click', () => {

        const currentBalance = customer.balance;
        const transactionAmount = +$('#transactionAmount').val();
        const newBalance = currentBalance + transactionAmount;
        customer.balance = newBalance;

        deposit.id = null;
        deposit.customerId = customerId;
        deposit.transactionAmount = transactionAmount;
        page.dialogs.commands.deposit(customer, deposit);
    })

}

page.loadData = () => {
    page.commands.getAllCustomers();
}

$(() => {
    page.loadData();
    page.initializeControlEvent();
})