'use client'
import { useState } from 'react'
import IngameMenu from './ingame-menu'

const RightSideBar = () => {
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <div className='absolute top-0 right-0 md:w-[25rem] h-full z-10'>
      Game Wiki
      <div className='cursor-pointer ' onClick={() => setOpenMenu(!openMenu)}>Menu</div>
      {
        openMenu && <IngameMenu />
      }
    </div>
  )
}

export default RightSideBar