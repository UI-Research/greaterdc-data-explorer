require "csv"
require "json"
require "fileutils"

def csv2json(path)
  csv = CSV.read(path, headers: true, converters: :all)

  headers = csv.headers
  rows = csv
    .to_a
    .drop(1)
    .map{ |row| Hash[headers.zip(row)] }
    .reject{ |h| h.values.all? { |v| v.nil? } } # remove possible empty rows

  destination_path = [
    __dir__,
    "../app/assets/data",
    File.dirname(path).sub(/^.*data\//, ""),
    "#{File.basename(path, ".csv")}.json",
  ]
  json_path = File.expand_path File.join(*destination_path)
  json_dir = File.expand_path File.join(*destination_path[0..-2])

  # create directory if needed
  FileUtils.mkdir_p(json_dir) unless File.directory?(json_dir)

  File.open(json_path, "w") do |file|
    file.write(rows.to_json)
  end
end

path = ARGV[0]

if !File.directory?(path) and ((path || "").empty? or File.extname(path.strip) != ".csv")
  puts <<~HELP
    Invalid file or wrong extension

    Usage: ruby scripts/csv2json.rb path/to/folder
    or
    Usage: ruby scripts/csv2json.rb path/to/file.csv
  HELP

  return 1
end

if File.directory?(path)
  puts "Processing directory..."
  Dir.glob("#{path.sub(/\/$/, "")}/**/*.csv").each do |file|
    print "Processing #{file}... "
    # puts "#{file}: wrote #{csv2json(file)} bytes"
    csv2json(file)
    puts "Done!"
  end
else
  puts "Is single file"
  csv2json(path)
end

