#include <iostream>
#include "include/api.hpp"

int main() {
    std::cout << "Automotive Digital Cockpit Backend Starting..." << std::endl;

    // Init server / telemetry
    initAPI();

    return 0;
}
