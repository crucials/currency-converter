"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const EXCHANGE_RATE_API = 'https://www.cbr-xml-daily.ru/latest.js';
setupTheme();
let ratesPromise = getRates();
let lastEditedField;
window.addEventListener('load', () => {
    if (localStorage.getItem('theme') == 'dark') {
        document.querySelector('#themeIcon').src = 'images/moon.png';
    }
    setInterval(() => {
        ratesPromise = getRates();
    }, 60000);
});
function setupTheme() {
    if (localStorage.getItem('theme') == null) {
        localStorage.setItem('theme', 'dark');
    }
    const theme = localStorage.getItem('theme');
    if (theme == 'dark') {
        document.documentElement.classList.add('dark');
    }
    else if (theme == 'light') {
        document.documentElement.classList.remove('dark');
    }
}
function switchTheme() {
    document.documentElement.classList.toggle('dark');
    const theme = localStorage.getItem('theme');
    const themeIcon = document.querySelector('#themeIcon');
    if (theme == 'dark') {
        localStorage.setItem('theme', 'light');
        themeIcon.src = 'images/sun.png';
    }
    else if (theme == 'light') {
        localStorage.setItem('theme', 'dark');
        themeIcon.src = 'images/moon.png';
    }
}
function selectCurrency(event) {
    const selectedCurrency = event.currentTarget;
    const currenciesList = selectedCurrency.parentElement;
    currenciesList === null || currenciesList === void 0 ? void 0 : currenciesList.querySelectorAll('.currency').forEach(currency => {
        currency.removeAttribute('data-selected');
    });
    selectedCurrency.setAttribute('data-selected', '');
    lastEditedField.dispatchEvent(new InputEvent('input'));
}
function convert(event) {
    var _a, _b;
    const fromField = event.target;
    lastEditedField = fromField;
    let toField;
    document.querySelectorAll('#fromField, #toField').forEach(field => {
        if (field != fromField) {
            toField = field;
        }
    });
    if (toField) {
        let fromCurrency;
        let toCurrency;
        (_a = fromField.parentElement) === null || _a === void 0 ? void 0 : _a.querySelectorAll('.currency').forEach(element => {
            var _a;
            if (element.hasAttribute('data-selected')) {
                const elementText = (_a = element.querySelector('span')) === null || _a === void 0 ? void 0 : _a.textContent;
                if (elementText) {
                    fromCurrency = elementText;
                }
            }
        });
        (_b = toField.parentElement) === null || _b === void 0 ? void 0 : _b.querySelectorAll('.currency').forEach(element => {
            var _a;
            if (element.hasAttribute('data-selected')) {
                const elementText = (_a = element.querySelector('span')) === null || _a === void 0 ? void 0 : _a.textContent;
                if (elementText) {
                    toCurrency = elementText;
                }
            }
        });
        const fromValue = fromField.value;
        if (fromValue.trim().length != 0) {
            ratesPromise.then(rates => {
                if (toField) {
                    rates.RUB = 1;
                    const result = Number(fromValue) / rates[fromCurrency] * rates[toCurrency];
                    toField.value = String(result.toFixed(3));
                }
            });
        }
        else {
            toField.value = '';
        }
    }
}
function reverse() {
    var _a, _b, _c, _d;
    const fromCurrencies = document.getElementById('fromCurrenciesList');
    const toCurrencies = document.getElementById('toCurrenciesList');
    const fromCurrency = (_b = (_a = fromCurrencies.querySelector('.currency[data-selected]')) === null || _a === void 0 ? void 0 : _a.querySelector('span')) === null || _b === void 0 ? void 0 : _b.textContent;
    const toCurrency = (_d = (_c = toCurrencies.querySelector('.currency[data-selected]')) === null || _c === void 0 ? void 0 : _c.querySelector('span')) === null || _d === void 0 ? void 0 : _d.textContent;
    if (fromCurrency && toCurrency) {
        fromCurrencies.querySelectorAll('li').forEach(currencyElement => {
            var _a;
            if (((_a = currencyElement.querySelector('span')) === null || _a === void 0 ? void 0 : _a.textContent) == toCurrency) {
                currencyElement.dispatchEvent(new MouseEvent('click'));
            }
        });
        toCurrencies.querySelectorAll('li').forEach(currencyElement => {
            var _a;
            if (((_a = currencyElement.querySelector('span')) === null || _a === void 0 ? void 0 : _a.textContent) == fromCurrency) {
                currencyElement.dispatchEvent(new MouseEvent('click'));
            }
        });
    }
    lastEditedField.dispatchEvent(new InputEvent('input'));
}
function getRates() {
    return __awaiter(this, void 0, void 0, function* () {
        const responseJSON = yield (yield fetch(EXCHANGE_RATE_API)).json();
        return responseJSON.rates;
    });
}
