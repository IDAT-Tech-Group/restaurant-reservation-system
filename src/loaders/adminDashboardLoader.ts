import { redirect } from "react-router-dom"

export const adminDashboardLoader = () => {
  const storedUser = localStorage.getItem('user')

  if (!storedUser) {
    return redirect('/login')
  }

  try {
    const user = JSON.parse(storedUser)

    if (user?.username !== 'admin@gmail.com') {
      return redirect('/')
    }

    return null
  } catch {
    localStorage.removeItem('user')
    return redirect('/login')
  }
}