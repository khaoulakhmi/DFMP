import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export function AuthListener() {
  const navigate = useNavigate()

  useEffect(() => {
    console.log('AuthListener mounted')
    const handleLogout = () => navigate('/login', { replace: true })

    window.addEventListener('auth:logout', handleLogout)
    return () => window.removeEventListener('auth:logout', handleLogout)
  }, [navigate])

  return null
}