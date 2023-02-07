import * as te from "./util/StorageTemp.js"
import * as lsProcessor from "./util/LocalStorageProcessor.js"
import * as sc from "./util/StringCollection.js"

const temp = te.temp
let storage
main()

function main() {
    storage = lsProcessor.load(sc.cartKey)

    if (storage != null) {
        temp.cart = storage

        const form = document.querySelector("form")
    
        console.log(form)
    
        form.addEventListener("submit", handleSubmit)
    }
}

function handleSubmit(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const obj = Object.fromEntries(formData.entries())

    setOrderInfo(obj)
    temp.cart.info = temp.info

    console.log(obj)
    console.log(temp.cart)
}

function setOrderInfo(obj) {
    const storage = lsProcessor.load(sc.cartKey)
    const info = temp.info

    info.payment_method = getPayment(obj.payment)
    info.order_date = getFullDateString()
    info.recipient_name = obj.username
    info.recipient_phone = obj.phone

    info.order_total = storage.info.order_total
    info.shipping_address = obj.address
    info.status = "處理中"
}

function getPayment(value){
    const payment = ["信用卡線上刷卡", "7-11取貨付款", "悠遊卡", "ATM付款(轉帳/線上繳款)"]
    return payment[parseInt(value) - 1]
}

function getFullDateString() {
    const currentdate = new Date()

    return currentdate.getFullYear() + "-"
        + (currentdate.getMonth() + 1) + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds()
}