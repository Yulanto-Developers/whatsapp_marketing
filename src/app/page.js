
"use client";
import Image from "next/image";
import "../../public/css/main.css";
import { useDispatch } from "react-redux";
import { login } from './redux/Slice/slice'
import { useState } from "react";
import { useRouter } from 'next/navigation';


export default function Home() {

  const [form, setform] = useState({
    email: '',
    password: ''
  });

  const navigate = useRouter();

  const dispatch = useDispatch();


  function handlechanges(e) {
    const { name, value } = e.target;

    setform((val) => ({ ...val, [name]: value }
    ));
  }

  async function submit(e) {
    e.preventDefault();

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: `
            query  Login($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                success
                message
                user {
                  id
                  email
                }
              }
            }
          `,
          variables: {
            email: form.email,
            password: form.password,
          },
        }),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      const response = JSON.parse(text);
      console.log("GraphQL response:", response);

      if (response.errors) {
        alert(response.errors[0].message);
        return;
      }

      const { success, message, user } = response.data.login;

      if (success) {
        dispatch(login({ id: user.id, email: user.email }));
        alert("Login successful");
        navigate.push('/dashboard/home')
      } else {
        alert(message);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong");
    }
  }



  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Login
        </h2>

        <form className="space-y-5" onSubmit={submit}>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Email ID
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email ID"
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              onChange={handlechanges}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              className="px-4 py-2 border  rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-orange-400"
              onChange={handlechanges}
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition duration-300 shadow-md"

          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
