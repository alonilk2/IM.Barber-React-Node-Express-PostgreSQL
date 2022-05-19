import { useEffect, useState, useRef } from 'react'
import { SHIPPING_PRICE } from '../Constants/generalConstants'

export default function useCart () {
  const [cart, setCart] = useState([])
  const totalSum = useRef(SHIPPING_PRICE)
  const count = useRef(0)

  // If product already in cart - only add to quantity without adding new row and returns new cart object
  const increaseQuantityIfExist = product => {
    let tempCart = cart
    let isExist = false
    tempCart.forEach(prod => {
      if (prod.id === product.id) {
        prod.quantity =
          prod.quantity && prod.quantity > 0 ? prod.quantity + 1 : 1
        totalSum.current += product.price
        isExist = true
      }
    })
    return { isExist, tempCart }
  }

  const addToCart = product => {
    let { isExist, tempCart } = increaseQuantityIfExist(product),
      newCart = []
    if (!isExist) {
      product.quantity = 1
      newCart = [...cart, product]
      count.current++
    } else newCart = tempCart
    totalSum.current += product.price
    saveCart(newCart)
  }

  const deleteFromCart = product => {
    let tempCart = cart
    tempCart.forEach((prod, index) => {
      if (prod.id === product.id) {
        if (product.quantity)
          totalSum.current -= product.price * product.quantity
        else totalSum.current -= product.price
        count.current--
        if (count.current === 0) return resetCart()
        else {
          tempCart.splice(index, 1)
          saveCart([...tempCart])
        }
      }
    })
  }

  const saveCart = tempCart => {
    localStorage.setItem('cart', JSON.stringify(tempCart))
    setCart(tempCart)
  }

  const changeQuantity = (product, quantity = 1) => {
    let tempCart = cart
    tempCart.forEach(prod => {
      if (product.id === prod.id) prod.quantity = quantity
    })
    saveCart(tempCart)
    return calculateTotalSum(tempCart)
  }

  const calculateTotalSum = arr => {
    totalSum.current = SHIPPING_PRICE
    arr.forEach(product => {
      totalSum.current += product.quantity
        ? product.quantity * product.price
        : product.price
    })
    return totalSum.current
  }

  const resetCart = () => {
    totalSum.current = SHIPPING_PRICE
    count.current = 0
    setCart([])
    localStorage.removeItem('cart')
    return true
  }

  const initCart = () => {
    let storage = localStorage.getItem('cart')
    if (storage) {
      let Json = JSON.parse(storage)
      calculateTotalSum(Json)
      count.current = Json.length
      setCart(Json)
    }
  }

  useEffect(() => {
    initCart()
  }, [])

  return [
    cart,
    count.current,
    totalSum.current,
    addToCart,
    deleteFromCart,
    changeQuantity,
    resetCart
  ]
}
