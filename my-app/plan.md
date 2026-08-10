# FieldTrack

# GeoAttend
## GIS & GPS-Enabled Smart Trainee Attendance System

**Domain:** IT / GIS & GPS
**Category:** Location-Aware Web Application

---

## 1. Abstract

GeoAttend is a location-aware web application that automates and verifies trainee officer attendance using GPS geofencing. It is designed for training environments that span multiple physical locations — field training exercises, outdoor forestry visits, and campus lectures — where traditional attendance methods (paper registers, manual roll calls, or simple app-based check-ins) fail to confirm a trainee's actual physical presence. The system validates a trainee's real-time GPS coordinates against a predefined geofenced boundary around each training site before marking attendance, and provides training officers with a live, map-based dashboard to monitor attendance across all active locations in real time.

---

## 2. Problem Statement

Trainee officer training programs are conducted across a variety of scattered locations, including indoor classrooms, outdoor field exercise grounds, and forestry field sites. Existing attendance systems face the following limitations:

- **No location verification:** Digital check-in methods (manual entry, simple QR codes) do not confirm the trainee was physically present at the correct site.
- **Proxy attendance:** Trainees can mark attendance on behalf of absent peers.
- **Fragmented tracking:** Training officers cannot monitor attendance across multiple, simultaneously active sites.
- **Manual consolidation overhead:** Administrators spend significant time compiling attendance records from different instructors and locations.
- **No real-time visibility:** Coordinators lack a live view of who has checked in, where, and when.

**Statement:** There is no automated, location-verifiable system to record and consolidate trainee officer attendance across geographically dispersed training venues, resulting in proxy attendance, delayed reporting, and administrative overhead.

---

## 3. Objectives

1. Automate attendance capture using the trainee's device GPS location.
2. Verify a trainee's physical presence within a geofenced boundary before accepting an attendance entry.
3. Provide a real-time, map-based dashboard for training officers to monitor attendance across multiple sites.
4. Eliminate proxy attendance through location-based validation.
5. Reduce manual effort in attendance consolidation and reporting.

---

## 4. Scope of the Project

**In scope (hackathon prototype):**
- Trainee web check-in page with GPS capture
- Circular geofence validation (center coordinate + radius)
- Admin dashboard with live map showing geofence and check-in pins
- Attendance record storage and basic reporting

**Out of scope (future enhancements):**
- Polygon-shaped geofences for irregular forest boundaries
- Offline attendance sync for low-connectivity areas
- Anti-GPS-spoofing detection
- Native mobile application

---

## 5. Existing System vs. Proposed System

| Aspect | Existing System | Proposed System (GeoAttend) |
|---|---|---|
| Attendance method | Manual/paper or basic digital | GPS-verified digital check-in |
| Location proof | None | Geofence validation |
| Proxy attendance | Possible | Prevented via location check |
| Multi-site tracking | Manual coordination | Live unified dashboard |
| Reporting | Manual compilation | Automated, real-time |

---

## 6. System Architecture

```
 [Trainee Device: Browser]
          |
          |  1. GPS coordinates captured (Geolocation API)
          v
 [Trainee Check-in Web Page]
          |
          |  2. POST { traineeId, siteId, lat, lon, timestamp }
          v
 [Backend Server (Node.js / Express)]
          |
          |  3. Fetch site geofence data
          |  4. Calculate distance (Haversine formula)
          |  5. Validate: distance <= allowed radius?
          v
 [Database (Firebase Firestore)]
          |   stores: trainees, sites, attendance records
          v
 [Admin Dashboard (Leaflet.js map)]
          |
          |  6. Real-time listener updates map with new check-ins
          v
 [Training Officer / Admin View]
```

---

## 7. Technology Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript (or React) |
| Mapping/GIS | Leaflet.js (OpenStreetMap tiles) |
| Backend | Node.js with Express.js |
| Database | Firebase Firestore |
| Geolocation | Browser Geolocation API |
| Hosting | Vercel/Netlify (frontend), Render/Railway (backend) |
| Version Control | Git & GitHub |

---

## 8. Modules

### 8.1 Trainee Check-in Module
- Displays a "Mark My Attendance" button
- Requests location permission and captures latitude, longitude, and GPS accuracy
- Sends check-in data to the backend
- Displays success ("Attendance marked at Forest Range A") or failure ("You are 320m outside the boundary") messages

### 8.2 Geofencing & Validation Module
- Stores each training site's center coordinates and allowed radius
- Calculates the distance between the trainee's location and the site center using the Haversine formula
- Accepts or rejects the check-in based on whether the distance is within the defined radius

### 8.3 Admin Dashboard Module
- Displays an interactive map with all active training sites and their geofence boundaries
- Shows live markers for trainees as they check in
- Lists attendance records with trainee name, site, time, and status
- Supports basic filtering (by site or date)

### 8.4 Database Module
- **Sites collection:** site name, latitude, longitude, radius
- **Trainees collection:** trainee ID, name, batch/group
- **Attendance collection:** trainee ID, site ID, latitude, longitude, timestamp, status

---

## 9. Geofencing Algorithm (Haversine Formula)

The Haversine formula calculates the great-circle distance between two GPS coordinates on Earth's surface, which is then compared to the site's defined radius.

```javascript
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Earth's radius in meters
  const toRad = deg => deg * Math.PI / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // distance in meters
}

function isInsideGeofence(traineeLat, traineeLon, site) {
  const distance = getDistanceMeters(traineeLat, traineeLon, site.latitude, site.longitude);
  return distance <= site.radiusMeters;
}
```

---

## 10. Workflow / Use Case

1. Admin registers a training site with its coordinates and geofence radius.
2. Trainee opens the check-in page at the training venue.
3. Trainee taps "Mark Attendance"; the browser captures GPS coordinates.
4. The system calculates the distance from the trainee to the site center.
5. If within the radius, attendance is marked "Present" and stored in the database.
6. If outside the radius, the check-in is rejected with a distance-based error message.
7. The admin dashboard updates in real time, showing the trainee's pin on the map.
8. Attendance records are available for review and export at the end of the session.

---

## 11. Advantages

- Eliminates proxy attendance through GPS-based location proof
- Provides real-time visibility for training officers across multiple sites
- Reduces manual effort in attendance consolidation
- Simple, web-based solution requiring no dedicated hardware
- Scalable to any number of training sites

---

## 12. Limitations

- GPS accuracy can degrade under dense forest canopy or indoors
- Requires trainees to have GPS-enabled smartphones with location permissions granted
- Basic version does not detect GPS spoofing/mock location apps
- Dependent on internet connectivity for real-time sync (offline mode is future scope)

---

## 13. Future Scope

- Polygon-based geofences for irregularly shaped forest/field boundaries
- Offline attendance capture with automatic sync when connectivity resumes
- Anti-spoofing measures (mock-location detection, photo verification with geotagging)
- Native mobile application with background geofence triggers
- Integration with biometric verification for double-factor confirmation
- Analytics dashboard with attendance trends and defaulter alerts

---

## 14. Conclusion

GeoAttend addresses a real, practical gap in training administration by combining GPS geofencing with a real-time web dashboard to ensure trainee officer attendance is both automated and location-verified. The system is lightweight, scalable, and directly applicable to field training exercises, forestry visits, and campus lectures, reducing administrative overhead while improving the accuracy and accountability of attendance records.

---

## 15. Team & Acknowledgment

*(Add team member names, roles, and institution/hackathon details here.)*