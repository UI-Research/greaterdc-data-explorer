require "csv"
require "json"

filename = ARGV[0]
if (filename || "").empty? or File.extname(filename.strip) != ".csv"
  puts <<~HELP
    Invalid file or wrong extension

    Usage: ruby scripts/convert.rb path/to/file.csv
  HELP

  return 1
end

csv = CSV.read(filename, headers: true, converters: :all)

headers = csv.headers
rows = csv.to_a.drop(1).map do |row|
  Hash[headers.zip(row)]
end

json_filename = filename.sub(/\.csv$/, ".json")
File.open(json_filename, "w") do |file|
  file.write(rows.to_json)
end
