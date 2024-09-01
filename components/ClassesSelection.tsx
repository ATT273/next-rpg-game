'use client';

import React, { useState, useEffect } from 'react'
import SkillSelection from './SkillSelecttion';
import classes from '@/data/classes';
import Image from 'next/image';
import LeftCaret from '@/svg/caret-left.svg';
import RightCaret from '@/svg/caret-right.svg';
import { motion } from "framer-motion"
import { Skills, Stats } from '@/types/player';

const ClassesSelection = ({ handleUpdateClassData }: { handleUpdateClassData: ({ plClass, stats, skills }: { plClass?: string, stats?: Stats, skills?: Skills[] }) => void }) => {
  const [activeClass, setActiveClass] = useState(0);
  const [selectedSkill, setSelectedSkill] = useState({ key: '' });
  const [xValue, setXValue] = useState('')
  const classKeys = ['knight', 'warrior', 'assassin', 'mage'];

  useEffect(() => {
    // setSelectedSkill({});
    handleUpdateClassData({ plClass: classes[classKeys[activeClass] as keyof typeof classes].key, stats: { ...classes[classKeys[activeClass] as keyof typeof classes].stats }, skills: [] })
    const _xValue = `${-(activeClass * 450)}px`;
    setXValue(_xValue)
  }, [activeClass]);

  const handlePrevClass = () => {
    if (activeClass > 0) setActiveClass(activeClass - 1)
  }

  const handleNextClass = () => {
    if (activeClass < 3) setActiveClass(activeClass + 1)
  }

  const handleSkillSelected = (data: Skills) => {
    setSelectedSkill(data);
    handleUpdateClassData({ skills: [data] });
  }

  return (
    <div className="character-classes__container w-full">
      <div className='class-container w-full'>
        <div className='class-image relative flex justify-center items-center h-full max-w-[450px] m-auto mb-5 overflow-hidden'>
          <motion.div
            className='flex flex-nowrap'
            animate={{ x: xValue }}>
            {
              classKeys.map((key, index) => (
                <Image
                  key={index}
                  src={classes[classKeys[index] as keyof typeof classes].image}
                  alt={classes[classKeys[index] as keyof typeof classes].key}
                  width={450} />
              ))
            }
          </motion.div>
          <div className='arrow-group absolute flex justify-between items-center w-full z-10'>
            <span className='prev-class h-[50px]' onClick={handlePrevClass}>
              <Image src={LeftCaret} alt="prev" width={50} height={50} className='cursor-pointer' />
            </span>
            <span className='next-class h-[50px]' onClick={handleNextClass}>
              <Image src={RightCaret} alt="next" width={50} height={50} className='cursor-pointer' />
            </span>
          </div>

        </div>
        <div className='class-info flex flex-col justify-center items-center'>
          <div className='class-stats flex gap-6'>
            <div><p className='text-white '><span className='font-semibold'>Hp:</span> {classes[classKeys[activeClass] as keyof typeof classes].stats.hp}</p></div>
            <div><p className='text-white '><span className='font-semibold'>Atk:</span> {classes[classKeys[activeClass] as keyof typeof classes].stats.atk}</p></div>
            <div><p className='text-white '><span className='font-semibold'>Def:</span> {classes[classKeys[activeClass] as keyof typeof classes].stats.def}</p></div>
            <div><p className='text-white '><span className='font-semibold'>Int:</span> {classes[classKeys[activeClass] as keyof typeof classes].stats.int}</p></div>
            <div><p className='text-white '><span className='font-semibold'>Spd:</span> {classes[classKeys[activeClass] as keyof typeof classes].stats.spd}</p></div>
          </div>
          <br />
          <SkillSelection skills={classes[classKeys[activeClass] as keyof typeof classes].skills} selectedSkill={selectedSkill.key} handleChooseSkill={handleSkillSelected} />
        </div>
      </div>
    </div>
  )
}

export default ClassesSelection
