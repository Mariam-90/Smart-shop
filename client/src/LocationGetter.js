function loginUser(credentials) {
  fetch('/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(credentials)
  })
  .then(response => response.json())
  .then(data => {
    if(data.success) {
      // המשתמש מחובר, עכשיו בקש את המיקום
      requestUserLocation();
    } else {
      // הטיפול בשגיאת התחברות
      console.error('Login failed');
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

function requestUserLocation() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      fetch('/save-location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_AUTH_TOKEN' // עדכן עם טוקן אמיתי
        },
        body: JSON.stringify({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
      });
    }, function(error) {
      console.error('Geolocation error:', error);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
}
