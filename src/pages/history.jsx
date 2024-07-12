import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function History() {
  return (
    <div className="min-h-screen bg-customBiru4 py-8 px-4">
      <div className="bg-white rounded shadow p-6">
        <div className="flex justify-between mb-4">
          <h1 className="text-2xl font-semibold">History</h1>
          <motion.button 
            whileHover={{ scale: 1.1 }} 
            whileTap={{ scale: 0.9 }} 
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            <Link to="/features">Test Now</Link>
          </motion.button>
        </div>
        <div className="mt-6">
          <h1 className="font-semibold text-2xl">Riwayat Interview Test</h1>
          <div className="mt-4">
            <table className="w-full">
              <tbody className='text-xl'>
                <motion.tr 
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} 
                  className="bg-gray-100"
                >
                  <td className="text-left py-4 px-6">Hiburan</td>
                  <td className="text-center py-4 px-6 text-green-600">Good</td>
                  <td className="text-right py-4 px-6">07 Desember 2023</td>
                </motion.tr>
                <motion.tr 
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} 
                  className="bg-white"
                >
                  <td className="text-left py-4 px-6">General-Perusahaan</td>
                  <td className="text-center py-4 px-6 text-red-600">Bad</td>
                  <td className="text-right py-4 px-6">07 Desember 2023</td>
                </motion.tr>
                <motion.tr 
                  whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }} 
                  className="bg-gray-100"
                >
                  <td className="text-left py-4 px-6">Kuliner dan Restoran</td>
                  <td className="text-center py-4 px-6 text-green-600">Good</td>
                  <td className="text-right py-4 px-6">04 Desember 2023</td>
                </motion.tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;