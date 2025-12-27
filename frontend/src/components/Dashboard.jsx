import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../App'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      navigate(`/${user.role}`)
    }
  }, [user, navigate])

  return <div>Redirecting...</div>
}

export default Dashboard