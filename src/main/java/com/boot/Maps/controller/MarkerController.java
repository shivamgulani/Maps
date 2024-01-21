package com.boot.Maps.controller;


import com.boot.Maps.model.Marker;
import com.boot.Maps.repository.MarkerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/markers")
public class MarkerController {

    @Autowired
    private MarkerRepository markerRepository;

    // Test endpoint
    @GetMapping("/test")
    @ResponseStatus(HttpStatus.OK)
    public String testEndpoint() {
        return "Test Endpoint";
    }

    // Get all markers
    @GetMapping
    public List<Marker> getAllMarkers() {
        return markerRepository.findAll();
    }

    // Get a specific marker by ID
    @GetMapping("/{id}")
    public ResponseEntity<Marker> getMarkerById(@PathVariable Long id) {
        return markerRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Create a new marker
    @RequestMapping(value = "/add", method = RequestMethod.POST)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Marker> createMarker( @RequestBody Marker marker) {
        Marker createdMarker = markerRepository.save(marker);
        return new ResponseEntity<>(createdMarker, HttpStatus.CREATED);
    }

    // Update an existing marker
    @PutMapping("/{id}")
    public ResponseEntity<Marker> updateMarker(@PathVariable Long id, @RequestBody Marker updatedMarker) {
        return markerRepository.findById(id)
                .map(existingMarker -> {
                    existingMarker.setLatitude(updatedMarker.getLatitude());
                    existingMarker.setLongitude(updatedMarker.getLongitude());
                    existingMarker.setDescription(updatedMarker.getDescription());
                    markerRepository.save(existingMarker);
                    return ResponseEntity.ok(existingMarker);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete a marker by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMarker(@PathVariable Long id) {
        return markerRepository.findById(id)
                .map(existingMarker -> {
                    markerRepository.delete(existingMarker);
                    return ResponseEntity.noContent().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
