#include "codeSolutions.hpp"
#include <cpr/cpr.h>
#include <nlohmann/json.hpp>
#include <string>

// Fix typo: "codesolutions" → "codeSolutions"
// Fix typo: "str::string" → "std::string"

std::string codeSolutions(const std::string& code, const std::string& language) {
    nlohmann::json payload = { {"code", code}, {"language", language} };
    auto r = cpr::Post(
        cpr::Url{ "http://localhost:8000/judge" },
        cpr::Body{ payload.dump() },
        cpr::Header{ {"Content-Type", "application/json"} }
    );
    return r.text; // or parse/format further
}
std::string codeSolutions(const std::string& code) {
	return codeSolutions(code, "cpp");
}