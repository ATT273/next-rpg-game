'use client';

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import ClassesSelection from '@/components/ClassesSelection';
import BounusStatsPointScreen from '@/components/BounusStatsPointScreen';
import useStore from '@/store/store';
import { useRouter } from 'next/navigation';

const CreateCharacter = () => {
    const [step, setStep] = useState(1);
    const [errors, setErrors] = useState({ error: '' });
    const player = useStore(state => state.player);
    const createPlayerStore = useStore(state => state.createPlayer);
    const [createPlayer, setCreatePlayer] = useState(player);
    const router = useRouter();

    useEffect(() => {
        if (player) setCreatePlayer(player)
    }, [player])
    useEffect(() => {
        if (createPlayer && step === 3) {
            createPlayerStore(createPlayer)
            router.push('/battle')
        }
    }, [createPlayer])


    const checkErrors = () => {
        let error = false;
        switch (step) {
            case 1:
                if (createPlayer.name === '') {
                    setErrors(prevState => ({ ...prevState, error: 'Please enter your character`s name' }));
                    error = true;
                }
                break;
            case 2:
                if (createPlayer.skills.length === 0) {
                    setErrors(prevState => ({ ...prevState, error: 'Select 1 skill to learn' }));
                    error = true;
                }
                break;
            default:
                error = false;
                break;
        }
        return error;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCreatePlayer(prev => ({ ...prev, name: e.target.value }))
    }
    const handleNextStep = () => {
        const error = checkErrors();
        if (!error) {
            setStep(step + 1);
            setErrors({ error: '' });
        }
    }

    const handlePrevStep = () => {
        setStep(step - 1);
    }
    const handleUpdateClassData = (data: any) => {
        setCreatePlayer(prevState => ({ ...prevState, ...data }))
    }

    const handleUpdateStats = (data: any) => {
        setCreatePlayer(prevState => ({ ...prevState, stats: { ...data } }))
    }
    // const handleCreate = () => {
    //     useStore.getState().createPlayer(createPlayer)
    // }
    return (
        <div className='create-character-wrapper m-auto p-3'>
            <h1 className='title font-bold text-3xl'>Create Your Character</h1>
            <div className='form flex flex-col items-center justify-start h-full'>
                <AnimatePresence>
                    {
                        step === 1 &&
                        <motion.div
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}>

                            <input id='name' type='text' className='form-input' placeholder="Enter your name" name='name' onChange={handleInputChange} value={createPlayer.name} />
                        </motion.div>
                    }
                    {
                        step === 2 &&
                        <motion.div
                            className='w-full'
                            initial={{ opacity: 0, scale: 0.2 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5 }}>
                            <ClassesSelection handleUpdateClassData={handleUpdateClassData} />
                            <p className='error'>{errors.error}</p>
                        </motion.div>
                    }
                    {
                        step === 3 &&
                        <div className='character-stats'>
                            <BounusStatsPointScreen
                                selectedClass={createPlayer.plClass}
                                handleUpdateStats={handleUpdateStats}
                                handlePrevStep={handlePrevStep} />
                        </div>
                    }
                </AnimatePresence>
                <div className='skill'></div>
                <div>
                    {
                        step < 3 && <button type='submit' className='btn bg-green' onClick={handleNextStep}>Next</button>
                    }
                </div>
            </div>
        </div>
    )
}

export default CreateCharacter