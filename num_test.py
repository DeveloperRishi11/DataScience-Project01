#! C:\Users\rishi\OneDrive\Desktop\Python\myenv\Scripts\python.exe
import numpy as np

# Matrix operations
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
product = np.dot(A, B)

# Random number generation
random_array = np.random.rand(3, 3)

# Statistical operation
std_dev = np.std(random_array)

print("Matrix A:\n", A)
print("Matrix B:\n", B)
print("Matrix Product:\n", product)
print("\nRandom Array:\n", random_array)
print("Standard Deviation of Random Array:", std_dev)
