"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"


export function RegisterForm() {



  return (
    <form  className="space-y-4">
      
     <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      Nome Completo
    </label>
    <input
      id="name"
      type="text"
      placeholder="Seu nome completo"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
    />
  </div>

  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      Email
    </label>
    <input
      id="email"
      type="email"
      placeholder="seu@email.com"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
    />
  </div>

  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      Senha
    </label>
    <input
      id="password"
      type="password"
      placeholder="Sua senha"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
    />
  </div>

  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700">
      Confirmar Senha
    </label>
    <input
      id="confirmPassword"
      type="password"
      placeholder="Confirme sua senha"
      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600"
    />
  </div>

  <button
    type="submit"
    className="w-full bg-green-600 text-white font-semibold py-2 rounded-md hover:bg-green-700 transition-colors"
  >
    Criar Conta
  </button>
    </form>
  )
}
