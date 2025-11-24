import { socialLinks } from "@/utils/social-links";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-8 px-20">
          <div>
            <h3 className="text-xl font-bold mb-4">Yalla<span className="text-third">Fantasy</span></h3>
            <p>Your gateway to AFCON 2025 fantasy football excitement.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul>
              <li><a href="#hero" className="hover:text-third transition duration-300">Home</a></li>
              <li><a href="#features" className="hover:text-third transition duration-300">Features</a></li>
              <li><a href="#how-it-works" className="hover:text-third transition duration-300">How It Works</a></li>
              <li><a href="#testimonials" className="hover:text-third transition duration-300">Testimonials</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul>
              <li><a href="#" className="hover:text-third transition duration-300">FAQ</a></li>
              <li><a href="#" className="hover:text-third transition duration-300">Contact Us</a></li>
              <li><a href="#" className="hover:text-third transition duration-300">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 px-20 py-4 text-center flex items-center justify-between">
          <p>&copy; {new Date().getFullYear()} YallaFantasy. All rights reserved.</p>
          <ul className="inline-flex items-center gap-1">
            {socialLinks.map(({name , url , icon : Icon})=> <li key={name}>
                <a href={url} target="_blank" className="bg-gray-950 size-10 rounded-md flex items-center justify-center"><Icon/></a>
            </li>)}
          </ul>
        </div>
      </div>
    </footer>
  );
}