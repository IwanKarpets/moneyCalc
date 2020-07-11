const totalBalance =  document.querySelector('.total__balance'),
    totalMoneyIncome = document.querySelector('.total__money-income'),
    totalMoneyExpenses= document.querySelector('.total__money-expenses'),
    form =  document.querySelector('#form'),
    operationName = document.querySelector('.operation__name'),
    operationAmount =  document.querySelector('.operation__amount'),
    historyList =  document.querySelector('.history__list')

console.log(totalBalance, totalMoneyIncome, totalMoneyExpenses, form, operationName, operationAmount)

let dbOperation = [];

if(localStorage.getItem('calc')){
    dbOperation = JSON.parse(localStorage.getItem('calc'));
}



const renderOperation =(operation)=>{
    const className = operation.amount < 0 ? 
    'history__item-minus': 'history__item-plus';
    const listItem = document.createElement('li');
    listItem.classList.add('history__item');
    listItem.classList.add(className);
    listItem.innerHTML =`${operation.description}
    <span class="history__money">${operation.amount} ₽</span>
    <button class="history_delete" data-id="${operation.id}">x</button>  
    `;
    historyList.append(listItem);

   

};


const updateBalance = ()=>{
    const resultIncome = dbOperation
        .filter((item)=>item.amount>0).reduce((result, item)=>result+item.amount,0);
    console.log(resultIncome)

    const resultExpenses = dbOperation
        .filter(item=>item.amount<0).reduce((result,item)=>result+item.amount,0)
    console.log(resultExpenses)

    totalMoneyIncome.textContent= resultIncome+ ' руб';
    totalMoneyExpenses.textContent = resultExpenses+ ' руб';
    totalBalance.textContent = (resultExpenses+resultIncome)+' руб';
};

const generateId=()=>{
    return `itIwan${Math.round(Math.random()*1e8).toString(16)}`
}


const init = () =>{
    historyList.textContent = '';
    dbOperation.forEach(item=>{
        renderOperation(item);
    });
    updateBalance(); 
    localStorage.setItem('calc', JSON.stringify(dbOperation));

};

const addOperation =(e)=>{
    e.preventDefault();
    let operationNameValue = operationName.value,
        operationAmountValue = operationAmount.value;
        operationName.style.borderColor = '';
        operationAmount.style.borderColor = '';
    if(operationNameValue && operationAmountValue ){
        const operation ={
            id: generateId(),
            description: operationNameValue,
            amount: parseInt(operationAmountValue),
        }
        dbOperation.push(operation);
        init();
        operationAmountValue = '';
        operationNameValue = '';
    }
    else{
        if(!operationNameValue )  operationName.style.borderColor = 'red';
        if(!operationAmountValue) operationAmount.style.borderColor = 'red';
    }
}


const deleteOperation =(e)=>{
    if(e.target.classList.contains('history_delete')){
        dbOperation = dbOperation.filter(operation=>{
            return operation.id !== e.target.dataset.id;
        });
        init();
    }
}

form.addEventListener('submit', addOperation);
historyList.addEventListener('click', deleteOperation)
init();



