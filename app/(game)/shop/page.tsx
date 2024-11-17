'use client'

import { SHOP_EVENT } from '@/data/data'
import useStore from '@/store/store'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
const Shop = () => {
  const router = useRouter()
  const setCurrentEvent = useStore(state => state.setCurrentEvent);
  useEffect(() => {
    setCurrentEvent(SHOP_EVENT)
    router.push('/battle')
  }, [])
  return (
    <div>Shop</div>
  )
}

export default Shop