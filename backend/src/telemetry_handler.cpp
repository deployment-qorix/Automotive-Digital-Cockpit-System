#include <iostream>
#include <fstream>
#include <string>

void readTelemetryData() {
    std::ifstream file("data/telemetry_sample.csv");
    std::string line;
    while (std::getline(file, line)) {
        std::cout << "Telemetry: " << line << std::endl;
    }
}
