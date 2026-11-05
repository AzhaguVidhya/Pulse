export const loadData = (key, initialData = []) => {
  try {
    const savedData = localStorage.getItem(key)
    return savedData ? JSON.parse(savedData) : initialData
  } catch (error) {
    console.error(`Error loading ${key}:`, error)
    return initialData
  }
}

export const saveData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data))

  window.dispatchEvent(new Event('pulse-data-updated'))
}