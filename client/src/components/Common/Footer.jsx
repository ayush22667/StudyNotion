import React from "react";
import { Link } from "react-router-dom";

// Images
import Logo from "../../assets/Logo/Logo-Full-Light.png";

// Icons
import { FaFacebook, FaGoogle, FaTwitter, FaYoutube } from "react-icons/fa";

const BottomFooter = ["Privacy Policy", "Cookie Policy", "Terms"];
const Resources = [
  "Articles",
  "Blog",
  "Chart Sheet",
  "Code challenges",
  "Docs",
  "Projects",
  "Videos",
  "Workspaces",
];
const Plans = ["Paid memberships", "For students", "Business solutions"];
const Community = ["Forums", "Chapters", "Events"];

const Footer = () => {
  return (
    <div className="bg-richblack-800">
      <div className="flex flex-col lg:flex-row gap-8 items-center justify-between w-11/12 max-w-maxContent text-richblack-400 leading-6 mx-auto py-14">
        {/* Logo and Company Info */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <img src={Logo} alt="Prince Academy" className="object-contain h-8" />
          <p className="text-sm text-center lg:text-left">
            Your gateway to quality education
          </p>
          <div className="flex gap-4 text-lg">
            <FaFacebook className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
            <FaGoogle className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
            <FaTwitter className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
            <FaYoutube className="cursor-pointer hover:text-richblack-50 transition-all duration-200" />
          </div>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex flex-col gap-2">
            <h3 className="text-richblack-50 font-semibold text-[16px] mb-2">
              Company
            </h3>
            <Link to="/about" className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
              About
            </Link>
            <Link to="/contact" className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
              Contact
            </Link>
          </div>

          <div className="flex flex-col gap-2">
            <h3 className="text-richblack-50 font-semibold text-[16px] mb-2">
              Support
            </h3>
            <Link to="/help" className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
              Help Center
            </Link>
            <Link to="/privacy" className="text-[14px] cursor-pointer hover:text-richblack-50 transition-all duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between w-11/12 max-w-maxContent text-richblack-400 mx-auto  pb-14 text-sm">
        {/* Section 1 */}
        <div className="flex justify-between lg:items-start items-center flex-col lg:flex-row gap-3 w-full">
          <div className="flex flex-row">
            {BottomFooter.map((ele, i) => {
              return (
                <div
                  key={i}
                  className={` ${
                    BottomFooter.length - 1 === i
                      ? ""
                      : "border-r border-richblack-700 cursor-pointer hover:text-richblack-50 transition-all duration-200"
                  } px-3 `}
                >
                  <Link to={ele.split(" ").join("-").toLocaleLowerCase()}>
                    {ele}
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="text-center">© 2023 Prince Academy. All rights reserved.</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
