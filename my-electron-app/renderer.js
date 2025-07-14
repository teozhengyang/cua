function showAlert() {
  alert('Hello from Electron!');
  document.getElementById('demo').innerHTML = 'Button clicked!';
}

console.log('Node.js version:', process.versions.node);
console.log('Electron version:', process.versions.electron);