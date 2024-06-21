
const About = () => {
  return (
    <div className="bg-gradient-to-b from-white to-blue-100 min-h-screen flex items-center justify-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
          About Us
        </h1>
        <p className="text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
          We are dedicated to helping professionals succeed in their careers by providing top-notch interview preparation tools and resources.
        </p>
        <p className="text-2xl text-gray-600 mb-6 max-w-3xl mx-auto">
          Our mission is to empower job seekers with the skills and confidence they need to excel in interviews and secure their dream jobs.
        </p>
        <div className="mt-8 flex justify-center">
          <button className="mt-6 outline outline-offset-2 outline-4 outline-customBiru3 bg-gradient-to-r from-customBiru3 to-customBiru6 text-white py-3 px-8 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:from-customBiru4 hover:to-customBiru3">
            Learn Moree
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;