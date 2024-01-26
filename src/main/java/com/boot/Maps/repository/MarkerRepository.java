package com.boot.Maps.repository;

import com.boot.Maps.model.Marker;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MarkerRepository extends JpaRepository<Marker, Long> {

    Marker findByLatitudeAndLongitude(double latitude, double longitude);
}
