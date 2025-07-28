#!/usr/bin/env python3
"""
Data Analysis Project using NumPy, Matplotlib, and Pandas
A comprehensive example demonstrating matrix operations, data manipulation, and visualization
"""

import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
from datetime import datetime, timedelta

# Set random seed for reproducible results
np.random.seed(42)

print("=" * 60)
print("DATA ANALYSIS PROJECT")
print("=" * 60)

# 1. NUMPY OPERATIONS
print("\n1. NUMPY MATRIX OPERATIONS")
print("-" * 30)

# Matrix operations from original code
A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])
product = np.dot(A, B)

print("Matrix A:\n", A)
print("Matrix B:\n", B)
print("Matrix Product (A × B):\n", product)

# Additional matrix operations
determinant_A = np.linalg.det(A)
eigenvalues, eigenvectors = np.linalg.eig(A)

print(f"\nDeterminant of A: {determinant_A}")
print(f"Eigenvalues of A: {eigenvalues}")
print(f"Eigenvectors of A:\n{eigenvectors}")

# Random array operations
random_array = np.random.rand(5, 5)
std_dev = np.std(random_array)
mean_val = np.mean(random_array)

print(f"\nRandom 5x5 Array:\n{np.round(random_array, 3)}")
print(f"Standard Deviation: {std_dev:.4f}")
print(f"Mean: {mean_val:.4f}")

# 2. PANDAS DATA MANIPULATION
print("\n\n2. PANDAS DATA MANIPULATION")
print("-" * 30)

# Create sample dataset
dates = pd.date_range(start='2024-01-01', end='2024-12-31', freq='D')
n_days = len(dates)

# Generate synthetic sales data
np.random.seed(42)
sales_data = {
    'Date': dates,
    'Product_A_Sales': np.random.normal(100, 20, n_days).astype(int),
    'Product_B_Sales': np.random.normal(80, 15, n_days).astype(int),
    'Product_C_Sales': np.random.normal(60, 10, n_days).astype(int),
    'Temperature': np.random.normal(20, 8, n_days),
    'Region': np.random.choice(['North', 'South', 'East', 'West'], n_days)
}

df = pd.DataFrame(sales_data)
df['Total_Sales'] = df['Product_A_Sales'] + df['Product_B_Sales'] + df['Product_C_Sales']
df['Month'] = df['Date'].dt.month
df['Weekday'] = df['Date'].dt.day_name()

print("Dataset Info:")
print(f"Shape: {df.shape}")
print(f"Columns: {list(df.columns)}")
print("\nFirst 5 rows:")
print(df.head())

print("\nBasic Statistics:")
print(df[['Product_A_Sales', 'Product_B_Sales', 'Product_C_Sales', 'Total_Sales']].describe())

# Group by analysis
monthly_sales = df.groupby('Month')['Total_Sales'].agg(['mean', 'sum', 'std']).round(2)
print("\nMonthly Sales Summary:")
print(monthly_sales.head())

regional_sales = df.groupby('Region')['Total_Sales'].mean().round(2)
print("\nAverage Sales by Region:")
print(regional_sales)

# 3. MATPLOTLIB VISUALIZATIONS
print("\n\n3. CREATING VISUALIZATIONS")
print("-" * 30)

# Create a figure with multiple subplots
fig, axes = plt.subplots(2, 2, figsize=(15, 12))
fig.suptitle('Sales Data Analysis Dashboard', fontsize=16, fontweight='bold')

# Plot 1: Daily sales over time
monthly_totals = df.groupby('Month')['Total_Sales'].sum()
axes[0, 0].plot(monthly_totals.index, monthly_totals.values, marker='o', linewidth=2, markersize=6)
axes[0, 0].set_title('Monthly Total Sales Trend')
axes[0, 0].set_xlabel('Month')
axes[0, 0].set_ylabel('Total Sales')
axes[0, 0].grid(True, alpha=0.3)

# Plot 2: Product comparison (bar chart)
product_means = df[['Product_A_Sales', 'Product_B_Sales', 'Product_C_Sales']].mean()
bars = axes[0, 1].bar(range(len(product_means)), product_means.values, 
                      color=['#FF6B6B', '#4ECDC4', '#45B7D1'])
axes[0, 1].set_title('Average Sales by Product')
axes[0, 1].set_xlabel('Product')
axes[0, 1].set_ylabel('Average Daily Sales')
axes[0, 1].set_xticks(range(len(product_means)))
axes[0, 1].set_xticklabels(['Product A', 'Product B', 'Product C'])

# Add value labels on bars
for bar in bars:
    height = bar.get_height()
    axes[0, 1].text(bar.get_x() + bar.get_width()/2., height + 1,
                    f'{height:.1f}', ha='center', va='bottom')

# Plot 3: Regional sales distribution (pie chart)
regional_totals = df.groupby('Region')['Total_Sales'].sum()
colors = ['#FF9999', '#66B2FF', '#99FF99', '#FFCC99']
wedges, texts, autotexts = axes[1, 0].pie(regional_totals.values, labels=regional_totals.index, 
                                          autopct='%1.1f%%', colors=colors, startangle=90)
axes[1, 0].set_title('Sales Distribution by Region')

# Plot 4: Sales vs Temperature correlation
axes[1, 1].scatter(df['Temperature'], df['Total_Sales'], alpha=0.6, s=20)
z = np.polyfit(df['Temperature'], df['Total_Sales'], 1)
p = np.poly1d(z)
axes[1, 1].plot(df['Temperature'], p(df['Temperature']), "r--", alpha=0.8)
axes[1, 1].set_title('Sales vs Temperature Correlation')
axes[1, 1].set_xlabel('Temperature (°C)')
axes[1, 1].set_ylabel('Total Sales')
axes[1, 1].grid(True, alpha=0.3)

# Calculate correlation coefficient
correlation = np.corrcoef(df['Temperature'], df['Total_Sales'])[0, 1]
axes[1, 1].text(0.05, 0.95, f'Correlation: {correlation:.3f}', 
                transform=axes[1, 1].transAxes, verticalalignment='top',
                bbox=dict(boxstyle='round', facecolor='white', alpha=0.8))

plt.tight_layout()
plt.show()

# 4. ADVANCED ANALYSIS
print("\n4. ADVANCED ANALYSIS")
print("-" * 30)

# Correlation matrix
correlation_matrix = df[['Product_A_Sales', 'Product_B_Sales', 'Product_C_Sales', 
                        'Temperature', 'Total_Sales']].corr()
print("Correlation Matrix:")
print(correlation_matrix.round(3))

# Weekly patterns
weekly_pattern = df.groupby('Weekday')['Total_Sales'].mean().reindex([
    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
])
print("\nAverage Sales by Weekday:")
print(weekly_pattern.round(2))

# Statistical summary using NumPy
total_sales_array = df['Total_Sales'].values
print(f"\nNumPy Statistical Analysis of Total Sales:")
print(f"Mean: {np.mean(total_sales_array):.2f}")
print(f"Median: {np.median(total_sales_array):.2f}")
print(f"Standard Deviation: {np.std(total_sales_array):.2f}")
print(f"Min: {np.min(total_sales_array)}")
print(f"Max: {np.max(total_sales_array)}")
print(f"25th Percentile: {np.percentile(total_sales_array, 25):.2f}")
print(f"75th Percentile: {np.percentile(total_sales_array, 75):.2f}")

# Matrix operations with sales data
# Create a matrix from monthly sales data
monthly_matrix = df.groupby(['Month', 'Region'])['Total_Sales'].sum().unstack(fill_value=0)
print(f"\nMonthly Sales Matrix by Region:")
print(monthly_matrix.head().round(0))

# Matrix operations
matrix_mean = np.mean(monthly_matrix.values, axis=1)
print(f"\nAverage monthly sales across all regions:")
for i, month in enumerate(monthly_matrix.index[:5]):
    print(f"Month {month}: {matrix_mean[i]:.0f}")

print("\n" + "=" * 60)
print("ANALYSIS COMPLETE!")
print("=" * 60)