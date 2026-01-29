/* eslint-disable @next/next/no-img-element */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Header from "@/components/Header";
import Image from 'next/image';

export default function Home() {
  return (
    <div>
      <section className="text-gray-600 body-font">
        <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
          
          {/* Text Content */}
          <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
            <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">
              Welcome to Your Quiz System
              <br className="hidden lg:inline-block" />
              Engage and Educate
            </h1>
            <p className="mb-8 leading-relaxed">
              Create engaging quizzes effortlessly. Manage and track real-time results with ease. 
              Join quizzes using a unique ID and enjoy a seamless experience.
            </p>
            
            {/* Buttons */}
            <div className="flex justify-center">
              <a
                href="/create-quiz"
                className="inline-flex text-white bg-blue-500 border-0 py-2 px-6 focus:outline-none hover:bg-blue-600 rounded text-lg"
              >
                Create Quiz
              </a>
              <a
                href="/join-quiz"
                className="ml-4 inline-flex text-gray-700 bg-gray-100 border-0 py-2 px-6 focus:outline-none hover:bg-gray-200 rounded text-lg"
              >
                Join Quiz
              </a>
            </div>
          </div>

          {/* Image */}
          <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
            <Image
              className="object-cover object-center rounded"
              alt="hero"
              src="/1.png"
              width={720}
              height={600}
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
