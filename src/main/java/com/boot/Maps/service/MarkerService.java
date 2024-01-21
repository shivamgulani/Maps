package com.boot.Maps.service;



import com.boot.Maps.model.Marker;
import com.boot.Maps.repository.MarkerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class MarkerService {

    @Autowired
    private MarkerRepository markerRepository;

    public List<Marker> getAllMarkers() {
        return markerRepository.findAll();
    }

    public Optional<Marker> getMarkerById(Long id) {
        return markerRepository.findById(id);
    }

    public Marker createMarker(Marker marker) {
        return markerRepository.save(marker);
    }

    public Optional<Marker> updateMarker(Long id, Marker updatedMarker) {
        return markerRepository.findById(id)
                .map(existingMarker -> {
                    existingMarker.setLatitude(updatedMarker.getLatitude());
                    existingMarker.setLongitude(updatedMarker.getLongitude());
                    existingMarker.setDescription(updatedMarker.getDescription());
                    return markerRepository.save(existingMarker);
                });
    }

    public void deleteMarker(Long id) {
        markerRepository.deleteById(id);
    }
}
