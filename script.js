const input = document.querySelector('.inputText');
let ul = document.querySelector('.items');
let valueFromInput;

const debounce = (fn, ms) => {
    let timeout
    return function () {
        const fnCall = () => { fn.apply(this, arguments) }
        clearTimeout(timeout)
        timeout = setTimeout(fnCall, ms)
    }
}

const autocomplete = (data) => {
    let owner = data.owner
    const li = document.createElement('li')
    ul.prepend(li)
    li.textContent = data.name
    li.addEventListener('click', function() {
        input.value = ''
        const card = document.createElement('div');
        card.textContent = `Name: ${data.name} \n Owner: ${owner.login} \n Stars: ${data.size}`
        ul.after(card)
        const closeBtn = document.createElement('button')
        closeBtn.textContent = 'Del'
        card.appendChild(closeBtn)
        closeBtn.addEventListener('click', function() {
           card.remove()
        })
        //ul.innerHTML = ''
    })
}

function getData() {
    valueFromInput = this.value;
    return fetch(`https://api.github.com/search/repositories?q=${valueFromInput}`)
        .then(res => {
            return res.json()
        })
        .then(data => {
            return data.items.slice(-5)
        })
        .then(data => {
            console.log(data)
            ul.innerHTML = '';
            data.forEach(element => {
                autocomplete(element)
            })
        })
        .catch(err => console.log(err))
}

let newGetData = debounce(getData, 500)

input.addEventListener('input', newGetData)