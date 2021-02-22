const Modal = {
   /**  
    open() {
       document
          .querySelector(".modal-overlay")
          .classList.add("active");
    },
    close() {
       document
          .querySelector(".modal-overlay")
          .classList.remove("active");
    },
    */
   toggle() {
      document
         .querySelector(".modal-overlay")
         .classList.toggle("active");
   }
}

const Transaction = {
   all: [
      {
         description: "Luz",
         amount: -50000,
         date: '23/01/2021',
      },
      {
         description: "Criação de um Website",
         amount: 500000,
         date: '24/01/2021',
      },
      {
         description: "Internet",
         amount: -20000,
         date: '26/01/2021',
      },
   ],

   add(transaction) {
      Transaction.all.push(transaction);

      App.reload();
   },

   remove(index) {
      Transaction.all.splice(index, 1);

      App.reload();
   },

   incomes() {
      let incomes = 0;
      Transaction.all.forEach(transaction => {
         transaction.amount > 0 ? incomes += transaction.amount : incomes = incomes;
      })
      return incomes;
   }, // Incomes sum

   expenses() {
      let expenses = 0;
      Transaction.all.forEach(transaction => {
         transaction.amount < 0 ? expenses += transaction.amount : expenses = expenses;
      })
      return expenses;
   }, // Expenses sum

   total() {
      return Transaction.incomes() + Transaction.expenses();
   } // Incomes - Expenses
}

const DOM = {
   transactionsContainer: document.querySelector("#data-table tbody"),
   addTransaction(transaction, index) {
      const tr = document.createElement('tr');
      tr.innerHTML = DOM.innerHTMLTransaction(transaction)
      tr.dataset.index = index;
      DOM.transactionsContainer.appendChild(tr);
   },
   innerHTMLTransaction(transaction, index) {
      const CSSclass = transaction.amount > 0 ? "income" : "expense";

      const amount = Utils.formatCurrency(transaction.amount);

      const html = `
      <tr>
         <td class="description"> ${transaction.description} </td>
         <td class="${CSSclass}"> ${amount} </td>
         <td class="date"> ${transaction.date} </td>
         <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação"></td>
      </tr>
      `
      return html;
   },
   updateBalance() {
      document
         .getElementById("incomesDisplay")
         .innerHTML = Utils.formatCurrency(Transaction.incomes())
      document
         .getElementById("expensesDisplay")
         .innerHTML = Utils.formatCurrency(Transaction.expenses())
      document
         .getElementById("totalDisplay")
         .innerHTML = Utils.formatCurrency(Transaction.total())
   },
   clearHTML() {
      DOM.transactionsContainer.innerHTML = "";
   }
}

const Utils = {
   formatAmount(value) {
      value = Number(value) * 100;
      console.log(value);

      return value;
   },
   formatDate(date) {
      const splittedDate = date.split("-");

      return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`;
   },
   formatCurrency(value) {
      const signal = Number(value) < 0 ? "-" : ""

      value = String(value).replace(/\D/, "")

      value = Number(value) / 100

      value = value.toLocaleString("pt-BR", {
         style: "currency",
         currency: "BRL"
      })

      return signal + value;
   }
}

const Form = {
   description: document.querySelector("input#description"),
   amount: document.querySelector("input#amount"),
   date: document.querySelector("input#date"),

   getValues() {
      return {
         description: Form.description.value,
         amount: Form.amount.value,
         date: Form.date.value
      }
   },

   validateFields() {
      const { description, amount, date } = Form.getValues()

      if (description.trim() === "" ||
         amount.trim() === "" ||
         date.trim() === "") {
         throw new Error("Por favor, preencha todos os campos")

      }
   },

   formatValues() {
      let { description, amount, date } = Form.getValues();

      amount = Utils.formatAmount(amount);
      date = Utils.formatDate(date);

      console.log({
         description,
         amount,
         date
      });

      return {
         description,
         amount,
         date
      }
   },

   saveTransaction(transaction) {
      Transaction.add(transaction);
   },

   clearFields() {
      Form.description.value = "";
      Form.amount.value = "";
      Form.date.value = "";
   },
   submit(event) {
      event.preventDefault();

      try {
         Form.validateFields();
         const transaction = Form.formatValues();
         Form.saveTransaction(transaction);
         Form.clearFields();
         Modal.toggle();

      } catch (error) {
         alert(error.message);
      }
   }
}

const App = {
   init() {
      Transaction.all.forEach(DOM.addTransaction)

      DOM.updateBalance()
   },

   reload() {
      DOM.clearHTML();

      App.init();
   }
}

App.init();

Transaction.add({
   description: "Nova transação",
   amount: 1500,
   date: "21/02/2021"
})

Transaction.remove(4);