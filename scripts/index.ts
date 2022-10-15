const EXCHANGE_RATE_API = 'https://www.cbr-xml-daily.ru/latest.js'

setupTheme()

let ratesPromise = getRates()

let lastEditedField : HTMLInputElement

window.addEventListener('load', () => {
    if(localStorage.getItem('theme') == 'dark') {
        (document.querySelector('#themeIcon') as HTMLImageElement).src = 'images/moon.png'
    }
    
    setInterval(() => {
        ratesPromise = getRates()
    }, 60000)
})

function setupTheme() {
    if(localStorage.getItem('theme') == null) {
        localStorage.setItem('theme', 'dark')
    }

    const theme = localStorage.getItem('theme')

    if(theme == 'dark') {
        document.documentElement.classList.add('dark')
    }
    else if(theme == 'light') {
        document.documentElement.classList.remove('dark')
    }
}


function switchTheme() {
    document.documentElement.classList.toggle('dark')
    const theme = localStorage.getItem('theme')
    const themeIcon = document.querySelector('#themeIcon') as HTMLImageElement

    if(theme == 'dark') {
        localStorage.setItem('theme', 'light')
        themeIcon.src = 'images/sun.png'
    }
    else if(theme == 'light') {
        localStorage.setItem('theme', 'dark')
        themeIcon.src = 'images/moon.png'
    }
}

function selectCurrency(event : Event) {
    const selectedCurrency = event.currentTarget as HTMLElement
    const currenciesList = selectedCurrency.parentElement

    currenciesList?.querySelectorAll('.currency').forEach(currency => {
        currency.removeAttribute('data-selected')
    })

    selectedCurrency.setAttribute('data-selected', '')

    lastEditedField.dispatchEvent(new InputEvent('input'))
}

function convert(event : Event) {
    const fromField = event.target as HTMLInputElement

    lastEditedField = fromField

    let toField : HTMLInputElement | undefined

    document.querySelectorAll('#fromField, #toField').forEach(field => {
        if(field != fromField) {
            toField = field as HTMLInputElement
        }
    })

    if(toField) {
        let fromCurrency : string
        let toCurrency : string

        fromField.parentElement?.querySelectorAll('.currency').forEach(element => {
            if(element.hasAttribute('data-selected')) {
                const elementText = element.querySelector('span')?.textContent

                if(elementText) {
                    fromCurrency = elementText
                }
            }
        })
        toField.parentElement?.querySelectorAll('.currency').forEach(element => {
            if(element.hasAttribute('data-selected')) {
                const elementText = element.querySelector('span')?.textContent

                if(elementText) {
                    toCurrency = elementText
                }
            }
        })

        const fromValue = fromField.value

        if(fromValue.trim().length != 0) {
            ratesPromise.then(rates => {
                if(toField) {
                    rates.RUB = 1
                    const result = Number(fromValue) / rates[fromCurrency] * rates[toCurrency]

                    toField.value = String(result.toFixed(3))
                }
            })
        }
        else {
            toField.value = ''
        }
    }
}

function reverse() {
    const fromCurrencies = document.getElementById('fromCurrenciesList') as HTMLUListElement
    const toCurrencies = document.getElementById('toCurrenciesList') as HTMLUListElement

    const fromCurrency = fromCurrencies.querySelector('.currency[data-selected]')?.querySelector('span')?.textContent
    const toCurrency = toCurrencies.querySelector('.currency[data-selected]')?.querySelector('span')?.textContent

    if(fromCurrency && toCurrency) {
        fromCurrencies.querySelectorAll('li').forEach(currencyElement => {
            if(currencyElement.querySelector('span')?.textContent == toCurrency) {
                currencyElement.dispatchEvent(new MouseEvent('click'))
            }
        })

        toCurrencies.querySelectorAll('li').forEach(currencyElement => {
            if(currencyElement.querySelector('span')?.textContent == fromCurrency) {
                currencyElement.dispatchEvent(new MouseEvent('click'))
            }
        })
    }

    lastEditedField.dispatchEvent(new InputEvent('input'))
}

async function getRates() {
    const responseJSON = await (await fetch(EXCHANGE_RATE_API)).json()

    return responseJSON.rates
}