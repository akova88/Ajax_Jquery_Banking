class App {
    static DOMAIN_SERVER = 'http://localhost:3000';
    static API_SERVER = 'http://localhost:3000';
  
    static API_CUSTOMER = this.API_SERVER + '/customers';
    static API_DEPOSIT = this.API_SERVER + '/deposits';
    static API_WITHDRAW = this.API_SERVER + '/withdraws';
    static API_TRANSFER = this.API_SERVER + '/transfers';
  
    static showDeleteConfirmDialog() {
      return Swal.fire({
        icon: 'warning',
        text: 'Are you sure you want to delete the selected data ?',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it !',
        cancelButtonText: 'Cancel',
      });
    }
  
    static showSuccessAlert(t) {
      Swal.fire({
        icon: 'success',
        title: t,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  
    static showErrorAlert(t) {
      Swal.fire({
        icon: 'error',
        title: 'Warning',
        text: t,
      });
    }
  }
  
  class Customer {
    constructor(fullName, email, phone, address, balance, deleted) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.balance = balance;
        this.deleted = deleted;
    }
  }
  
  class Deposit {
    constructor(id, customerId, transactionAmount) {
      this.id = id;
      this.customerId = customerId;
      this.transactionAmount = transactionAmount;
    }
  }

