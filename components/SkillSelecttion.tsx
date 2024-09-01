import { Skills } from '@/types/player';
import React from 'react';

function SkillSelection({ skills, selectedSkill, handleChooseSkill }: { skills: Skills[], selectedSkill: string, handleChooseSkill: (skill: Skills) => void }) {
    return (
        <div className='skills-container'>
            <h3 className='title text-center mb-3 text-white text-xl'>Choose 1 skill</h3>
            <div className='flex-col gap-5 mb-5'>
                {
                    skills.map((item, index) => (
                        <div key={index} className={`skill-item flex gap-5 text-lg cursor-pointer p-2 ${selectedSkill === item.key ? 'active' : ''}`} onClick={() => handleChooseSkill(item)}>
                            <div className='name min-w-[200px] text-white'>{item.name}:</div>
                            <div className='cost'>cost: {item.cost}</div>
                            <div>target: <span className={`target-${item.target}`}>{item.target}</span></div>
                            {item.effects.map((fx, fxIndex) => (
                                <div key={fxIndex} className={`effects`}> <span className={`${fx.value > 0 ? 'text-emerald-500' : 'text-red-500'}`}>{fx.value}</span> {fx.stats}</div>
                            ))}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SkillSelection;
