import React from 'react'

const Timer = ({
  expiration
}) => {
  const [timeLeft, setTimeLeft] = React.useState('')
  React.useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(expiration) - new Date()
      const secondsLeft = Math.round(msLeft / 1000)
      const minutes = Math.floor(secondsLeft / 60)
      const seconds = secondsLeft % 60
      setTimeLeft(`${minutes} minutes ${seconds} seconds`)
    }
    findTimeLeft()
    const timerId = setInterval(findTimeLeft, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [expiration])
  return (
    <div>
      {timeLeft} seconds until this order expires
    </div>
  )
}

export default Timer