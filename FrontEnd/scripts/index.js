console.log("je suis un console log")

const getWorks = async() => {
    const response = await fetch("http://localhost:5678/api/works")
    const data = await response.json()
    console.log("🚀 ~ getWorks ~ data:", data)
}

getWorks()