/// <reference path="assets/jquery-3.7.0.min.js" />



class Customer {
    constructor(id, fullName, email, phone, address, balance) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.balance = balance;
    }
}
let maxId = 1;
let customerId = 0;
let customer = {};
// let customers = [
//     new Customer(maxId++, 'Nguyen Van A', 'vana@gmail.com', '0942432567', 'Viet Nam', 0),
//     new Customer(maxId++, 'Nguyen Van B', 'vanb@gmail.com', '0945454356', 'Viet Nam', 0),
//     new Customer(maxId++, 'Nguyen Van C', 'vanc@gmail.com', '0964554544', 'Viet Nam', 0),
//     new Customer(maxId++, 'Nguyen Van D', 'vand@gmail.com', '0925655466', 'Viet Nam', 0),
//     new Customer(maxId++, 'Nguyen Van E', 'vane@gmail.com', '0925764343', 'Viet Nam', 0),
//     new Customer(maxId++, 'Nguyen Van F', 'vanf@gmail.com', '0915576756', 'Viet Nam', 0)
// ];


function renderCustomes(obj) {
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
            <button class="btn btn-outline-primary">
                <i class="fas fa-exchange-alt"></i>
            </button>
            </td>   
            <td>
                <button class="btn btn-outline-danger"
                    onclick="return confirm('Are you sure? delete')">
                    <i class="fas fa-trash"></i>
                </button>  
            </td>
        </tr>
    `
}
const url = "http://localhost:3000/customers";

function getAllCustomers() {
    const tbCustomerBody = $('#tbCustomer tbody');
    tbCustomerBody.empty();
    
    $.ajax({
        type: 'GET',
        url: url
    })
    .done((data) => {
        data.forEach(item => {
        const str = renderCustomes(item);
        tbCustomerBody.prepend(str);
        handleAddAllEvent();
        });
    })
    .fail((error) => {
        console.log(error);
    })
}
getAllCustomers();

function handleAddAllEvent(){
    handleAddEventShowUpdate();
    handleAddEventShowDeposit();
    handleAddEventShowWithdraw();
}

// bắt sự kiện nhấn vô nút create
const btnCreate = $('#btnCreate');
btnCreate.off('click');
btnCreate.on('click', function () {
    const fullName = $('#fullNameCre').val();
    const email = $('#emailCre').val();
    const phone = $('#phoneCre').val();
    const address = $('#addressCre').val();
    const balance = 0;
    const deleted = 0;
    const obj = {
        fullName,
        email,
        phone,
        address,
        balance,
        deleted
    };
    // customers.push(obj);
    $.ajax({
        header: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'POST',
        url: url,
        data: obj
    })
        .done((data) => {
            const str = renderCustomes(data);
            const tbCustomerBody = $('#tbCustomer tbody');
            tbCustomerBody.prepend(str);

            handleAddAllEvent();
            $('#modalCreate').modal('hide');
        })
        .fail((error) => {
            
        })
})

function getCustomerById(id) {
    return $.ajax ({
        type: 'GET',
        url: 'http://localhost:3000/customers/' +id,
    });
    // return customers.find(item => item.id == id);
}

function findCustomerIndexById(id) {
    let index = -1;
    for (let i = 0; i < customers.length; i++) {
        if (customers[i].id === id) {
            index = i;
        }
    }
    return index;
}

// bắt sự kiện nhấn vô nút update
function handleAddEventShowUpdate() {
    let btnEdit = $('.edit');
    btnEdit.off('click');
    btnEdit.on('click', function(){
        customerId = $(this).data('id');
        const modalUpdate = $('#modalUpdate');

      getCustomerById(customerId).then((data) => {
        $('#fullNameUp').val(data.fullName);
        $('#emailUp').val(data.email);
        $('#phoneUp').val(data.phone);
        $('#addressUp').val(data.address);
      modalUpdate.modal('show');
      })
      .catch((error) => {
        console.log(error);
      })
    
      
    })

    // btnEdit.forEach(item => {
    //     item.addEventListener('click', function () {
    //         customerId = +item.getAttribute('data-id');
    //         const obj = getCustomerById(customerId);

    //         document.getElementById('fullNameUp').value = obj.fullName;
    //         document.getElementById('emailUp').value = obj.email;
    //         document.getElementById('phoneUp').value = obj.phone;
    //         document.getElementById('addressUp').value = obj.address;

    //         const modalUpdate = new bootstrap.Modal(document.getElementById('modalUpdate'), {
    //             keyboard: false
    //         })
    //         modalUpdate.show()
    //     })
    // })
}

// bắt sự kiện nhấn vô nút save edit
const btnUpdate = $('#btnUpdate');
btnUpdate.off('click');
btnUpdate.on('click', function () {
    const fullName = $('#fullNameUp').val();
    const email = $('#emailUp').val();
    const phone = $('#phoneUp').val();
    const address = $('#addressUp').val();

    const obj = {
        fullName,
        email,
        phone,
        address
    };

    // const index = findCustomerIndexById(customerId);
    // customers[index] = obj;
    // getAllCustomers();
    
    // $('#modalUpdate').modal('hide');
    update(obj);
})


function update(obj){
    $.ajax({
        headers: {
            'accept': 'application/json',
            'content-type': 'application/json'
        },
        type: 'PATCH',
        url: 'http://localhost:3000/customers/'+ customerId,
        data: JSON.stringify(obj)
    })
        .done((data) => {
            const str = renderCustomes(data);
            const currentRow = $('#tr_'+customerId);
            currentRow.replaceWith(str);
            $('#modalUpdate').modal('hide');
            handleAddAllEvent();
        })
        .fail((error) => {

        })
}

// bắt sự kiện nhấn vô nút Deposit
function handleAddEventShowDeposit() {
    let btnDeposit = $('.deposit');
    btnDeposit.off('click');
    btnDeposit.on('click', function () {
            customerId = $(this).data('id');
            const modalDeposit = $('#modalDeposit');

            getCustomerById(customerId).then((data) => {
                customer = data;
                $('#fullNameDeps').val(customer.fullName);
                $('#idDeps').val(customer.id);
                $('#balanceDeps').val(customer.balance);
                modalDeposit.modal('show');
            })
            .catch((error) => {
                console.log(error);
            })
            // const modalDeposit = new bootstrap.Modal(document.getElementById('modalDeposit'), {
            //     keyboard: false
            // })
            // modalDeposit.show()
        })
}

// bắt sự kiện nhấn vô nút save deposit
const btnSaveDeposit = $('#btnSaveDeposit');
btnSaveDeposit.off('click');
btnSaveDeposit.on('click', () => {

    const currentBalance = customer.balance;
    const transactionAmount = +$('#transactionAmount').val();
    const newBalance = currentBalance + transactionAmount;
    customer.balance = newBalance;

    const modalDeposit = $('#modalDeposit');

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
        const strData = renderCustomes(data);
        const currentRow = $('#tr_' + customerId);
        currentRow.replaceWith(strData);
        handleAddAllEvent();
        $('#transactionAmount').val('');
        $('#balanceDeps').val(data.balance);
        modalDeposit.modal('hide');
    })
    .fail((error) => {
        console.log();
    })
})

// btnSaveDeposit.addEventListener('click', function () {
//     const transactionAmount = +document.getElementById('transactionAmount').value;
//     if(!isNaN(transactionAmount)){
//         if ( transactionAmount < 0 ){
//             document.getElementById('successDeps').innerText ='';
//             document.getElementById('errorDeps').innerText = "Không được nhập số âm"
//         } else if (transactionAmount == 0) {
//             document.getElementById('successDeps').innerText ='';
//             document.getElementById('errorDeps').innerText = "Vui lòng nhập số tiền cần nạp"
//         } else {
//             const customerDeps = getCustomerById(customerId);
//             const newBalance = customerDeps.balance + transactionAmount;
//             customerDeps.balance = newBalance;
            
//             document.getElementById('transactionAmount').value = '';
//             document.getElementById('balanceDeps').value = newBalance;
//             document.getElementById('errorDeps').innerText ='';
//             document.getElementById('successDeps').innerText = 'Nạp tiền thành công!';
//         }
//     } else {
//         document.getElementById('successDeps').innerText ='';
//         document.getElementById('errorDeps').innerText = "Sai định dạng"  
//     }
//     getAllCustomers();
// })

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

    // btnWithdraw.forEach(item => {
    //     item.addEventListener('click', function () {
    //         customerId = +item.getAttribute('data-id');
    //         const obj = getCustomerById(customerId);
    //         document.getElementById('idWdr').value = customerId;
    //         document.getElementById('fullNameWdr').value = obj.fullName;
    //         document.getElementById('balanceWdr').value = obj.balance;


    //         const modalWithdraw = new bootstrap.Modal(document.getElementById('modalWithdraw'), {
    //             keyboard: false
    //         })
    //         modalWithdraw.show()
    //     })
    // })
}

// bắt sự kiện nhấn vô nút save WithDraw
const btnSaveWithdraw = $('#btnSaveWithdraw');
btnSaveWithdraw.off('click');
btnSaveWithdraw.on('click', () => {
    const currentBalance = customer.balance;
    const transactionAmountWdr = +$('#transactionAmountWdr').val();
    const newBalance = currentBalance - transactionAmountWdr;
    if(newBalance < 0) {
        $('#errorWdr').replaceWith("Số dư tài khoản không đủ");
    }
})

// btnSaveWithdraw.addEventListener('click', function () {
//     const transactionAmountWdr = +document.getElementById('transactionAmountWdr').value;
    
//     if(!isNaN(transactionAmountWdr)){
//         if ( transactionAmountWdr < 0 ){
//             document.getElementById('successWdr').innerText ='';
//             document.getElementById('errorWdr').innerText = "Không được nhập số âm"
//         } else if (transactionAmountWdr == 0) {
//             document.getElementById('successWdr').innerText ='';
//             document.getElementById('errorWdr').innerText = "Vui lòng nhập số tiền cần rút"
//         } else {
//             const customerWdr = getCustomerById(customerId);
//             const newBalance = customerWdr.balance - transactionAmountWdr;
//             if (newBalance < 0 ){
//                 document.getElementById('successWdr').innerText ='';
//                 document.getElementById('errorWdr').innerText = "Số dư tài khoản không đủ"
//             } else {
//                 customerWdr.balance = newBalance;
//                 document.getElementById('transactionAmountWdr').value = '';
//                 document.getElementById('balanceWdr').value = newBalance;
//                 document.getElementById('errorWdr').innerText ='';
//                 document.getElementById('successWdr').innerText = 'Rút tiền thành công!';
//             }
            
//         }
//     } else {
//         document.getElementById('successWdr').innerText ='';
//         document.getElementById('errorWdr').innerText = "Sai định dạng"  
//     }
//     getAllCustomers();
// })