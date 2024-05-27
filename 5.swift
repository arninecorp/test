import UIKit
import Foundation

class ViewController: UIViewController {

    let inputField: UITextField = {
    let field = UITextField()
    field.translatesAutoresizingMaskIntoConstraints = false
    field.placeholder = "URL"
    return field
  }()

  let saveButton: UIButton = {
    let button = UIButton(type: .system)
    button.translatesAutoresizingMaskIntoConstraints = false
    button.setTitle("Save", for: .normal)
    button.addTarget(self, action: #selector(saveInput), for: .touchUpInside)
    return button
  }()

  override func viewDidLoad() {
    super.viewDidLoad()
    setupViews()
  }

  private func setupViews() {
    view.addSubview(inputField)
    view.addSubview(saveButton)

    NSLayoutConstraint.activate([
      inputField.topAnchor.constraint(equalTo: view.safeAreaLayoutGuide.topAnchor, constant: 20),
      inputField.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      inputField.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
      
      saveButton.topAnchor.constraint(equalTo: inputField.bottomAnchor, constant: 40),
      saveButton.leadingAnchor.constraint(equalTo: view.leadingAnchor, constant: 20),
      saveButton.trailingAnchor.constraint(equalTo: view.trailingAnchor, constant: -20),
    ])
  }
    
  func getResponseBody(from url: URL, completion: @escaping (Result<Any, Error>) -> Void) {
    // Assume this function is returning a json response from the URL provided
    return jsonValue
  }
    
  func processJSON(json: Any) -> (String, String) {
    // Assume this function is returning two strings like:
    return (data, fileName)
  }
    
  @objc private func saveInput() {
    let input = inputField.text!  
    let url = URL(string: input)!
    getResponseBody(from: url) { result in
      switch result {
      case .success(let json):
        let (data, fileName) = processJSON(json: json)
        let documentsUrl =  FileManager.default.urls(for: .documentDirectory, in: .userDomainMask).first!
        let fileUrl = documentsUrl.appendingPathComponent(fileName)
        do {
          try data.write(to: fileUrl, atomically: true, encoding: .utf8)
          print("Success for:\nFile: " + fileName + "\nContent: " + data)
        } catch {
          print("Error writing file: \(error)")
        }
        case .failure(let error):
          print(error)
        }
      }
      
  }
}