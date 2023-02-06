import * as cookieParser from "./CookieParser.js"
import * as sc from "./StringCollection.js"
import * as te from "./StorageTemp.js"
import * as lsProcessor from "./LocalStorageProcessor.js"

const temp = te.temp
const elementIds = sc.productPageIds

main()

function main() {
    window.onload = () => {
        const cookieObj = cookieParser.parseCookie(document.cookie)
        const storage = lsProcessor.load(sc.ordersKey)

        if (storage != null) {
            temp.orders = storage
        }

        console.log(cookieObj)

        fetchData(cookieObj)
    }
}

async function fetchData(cookieObj) {
    let url = "/api/products/" + cookieObj.current_product
    fetch(url)
        .then(data => data.json())
        .then(value => parseValue(value))
        .catch(err => console.log(err))
}

const parseValue = value => {
    renderPage(value)
    
    setOrder(value)

    document.querySelector(elementIds.quantity).onchange = () => {
        setOrder(value)
    }
}

const renderPage = (value)=>{
    document.querySelector(elementIds.name).innerHTML = value.title
    document.querySelector(elementIds.price).innerHTML = sc.dollar + value.price
    document.querySelector(elementIds.descripion).innerHTML = value.description
    
    document.querySelector(elementIds.img).src = value.imageurl
}

const setOrder = productData => {
    const quantity = getProductQuantity()

    temp.orderDetail = {
        product: productData,
        quantity: quantity,
        subtotal: quantity * productData.price
    }

    saveOrderDetailToOrders(temp.orders)

    setBuyBtnListener(temp.orders)
}

const saveOrderDetailToOrders = (orders) => {
    let productId = temp.orderDetail.product.product_id
    orders.list[`${productId}`] = temp.orderDetail
}

const getProductQuantity = () => {
    const eQuantity = document.querySelector(elementIds.quantity)
    eQuantity.value = Math.min(Math.max(eQuantity.min, eQuantity.value), eQuantity.max)
    return eQuantity.value
}

const setBuyBtnListener = data => {
    const btn = document.querySelector(elementIds.btn)
    btn.onclick = () => {
        btn.classList.toggle('btn-warning')

        btn.innerHTML = "已購買"

        document.querySelector(elementIds.quantity).remove()
        document.querySelector(".qtext").remove()

        lsProcessor.save(sc.ordersKey, data)
    }
}