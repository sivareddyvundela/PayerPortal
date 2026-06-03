import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-blue-950 text-blue-200 py-6 px-6 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="font-bold text-white text-lg">HealthBridge</span>
          <span className="text-blue-400 text-sm">&copy; 2024. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
