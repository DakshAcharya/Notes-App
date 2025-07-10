// ==================== THEME MANAGEMENT ====================
// Functions for theme dialog and theme switching
function openThemeDialog() {
	const dialog = document.getElementById("ThemeDialog")
	dialog.showModal()
}

function closeThemeDialog() {
	document.getElementById("ThemeDialog").close()
}

function ChangeTheme() {
	const checked = document.querySelector(".theme-checkbox:checked")
	if (checked) {		
		document.body.className = ""                               // Clear existing theme classes
		document.body.classList.add(checked.id + "-theme")         // Apply new theme
		saveTheme(checked.id + "-theme")                          // Save theme to localStorage
	}
}

function saveTheme(themeName) {
	localStorage.setItem("Theme", themeName)                      // Save theme name
}

function loadTheme() {
	const theme = localStorage.getItem("Theme")
	if (theme) {                                                  
		document.body.classList.add(theme)                        // Apply saved theme
		const id = theme.replace("-theme", "")                    // Get checkbox ID from theme name
		const checkbox = document.getElementById(id)            
		if (checkbox) checkbox.checked = true                     // Check the relevant checkbox
	} else {
		document.body.classList.add("midnight-theme")             // Default theme
	}
}

// Theme checkbox event listeners
document.addEventListener("DOMContentLoaded", () => {
	loadTheme()

	// Handle theme selection changes
	document.querySelectorAll('.theme-checkbox').forEach((checkbox) => {
		checkbox.addEventListener('change', function() {
			if (this.checked) {
				// Uncheck all other checkboxes
				document.querySelectorAll('.theme-checkbox').forEach((cb) => {
					if (cb !== this) cb.checked = false
				})
				ChangeTheme()  // Apply the selected theme
			}
		})
	})
})

// ==================== NOTE MANAGEMENT ====================
let notes = []                      // Active notes
let deletedNotes = []               // Deleted notes
let editingID = null                // ID of note being edited
let deletedID = null                // ID of note being deleted
let currentlyDeletingNote = null;   // Note pending permanent deletion

// Note dialog functions
function openNoteDialog(noteID = null) {
	const dialog = document.getElementById("noteDialog")
	const title = document.getElementById("noteTitle")
	const content = document.getElementById("noteContent")

	if (noteID) {
		// Edit existing note
		const editNote = notes.find(note => note.id === noteID)
		editingID = noteID
		document.getElementById("dialogTitle").textContent = "Edit Note"
		title.value = editNote.title
		content.value = editNote.content
	} else {
		// Create new note
		editingID = null
		document.getElementById("dialogTitle").textContent = "Add New Note"
		title.value = ""
		content.value = ""
	}

	dialog.showModal()
	title.focus()
}

function closeNoteDialog() {
	document.getElementById("noteDialog").close()
}

// Save note (new or edited)
function saveNote(event) {
	event.preventDefault()

	const title = document.getElementById("noteTitle").value.trim()
	const content = document.getElementById("noteContent").value.trim()

	if (editingID) {
		// Update existing note
		const noteIndex = notes.findIndex(note => note.id === editingID)
		notes[noteIndex] = {...notes[noteIndex], title, content}
	} else {
		// Create new note
		notes.unshift({id: generateID(), title, content})
	}

	saveNotes()
	renderNotes()
	closeNoteDialog()
}

// Delete note (move to trash)
function deleteNotes(noteID) {
	notes = notes.filter(note => note.id !== noteID)
	saveNotes()
	renderNotes()
}

// Generate unique ID for notes
function generateID() {
	return Date.now().toString()
}

// Save/load active notes
function saveNotes() {
	localStorage.setItem("Notes App", JSON.stringify(notes))
}

function loadNotes() {
	const saved = localStorage.getItem("Notes App")
	return saved ? JSON.parse(saved) : []
}

// Render active notes to the DOM
function renderNotes() {
	const notesContainer = document.getElementById("notesContainer")
	const emptyState = document.getElementById("emptyState")

	if (notes.length === 0) {
		emptyState.style.display = "flex"
		notesContainer.style.display = "none"
	} else {
		emptyState.style.display = "none"
		notesContainer.style.display = "grid"
		notesContainer.innerHTML = notes.map(note => `
			<div class="note-card">
				<h3 class="note-title">${note.title}</h3>
				<p class="note-content">${note.content}</p>
				<div class="note-actions">
					<button class="edit-btn" onclick="openNoteDialog('${note.id}')" title="Edit Note">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
						</svg>
					</button>
					<button class="delete-btn" onclick="moveToDeletedPage('${note.id}')" title="Delete Note">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
							<path d="M18.3 5.71c-.39-.39-1.02-.39-1.41 0L12 10.59 7.11 5.7c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0L12 13.41l4.89 4.88c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4z"/>
						</svg>
					</button>
				</div>
			</div>
		`).join("")
	}
}

// ==================== DELETED NOTES MANAGEMENT ====================
// Navigation between pages
function showDeletedNotes() {
	window.location.href = "deleted.html"
}

function hideDeletedNotes() {
	window.location.href = "index.html"
}

// Save/load deleted notes
function saveDeletedNotes() {
	localStorage.setItem("Deleted Notes", JSON.stringify(deletedNotes))
}

function loadDeletedNotes() {
	const deleted = localStorage.getItem("Deleted Notes")
	return deleted ? JSON.parse(deleted) : []
}

// Move note to trash
function moveToDeletedPage(noteID) {
	const deleteNote = notes.find(note => note.id === noteID)
	deletedID = noteID

	// Remove from active notes
	notes = notes.filter(note => note.id !== noteID)
	
	// Add to deleted notes
	deletedNotes.unshift({
		id: deletedID,
		title: deleteNote.title,
		content: deleteNote.content
	})

	saveDeletedNotes()
	saveNotes()
	renderNotes()
}

// Render deleted notes to the DOM
function renderDeletedNotes() {
	const notesContainer = document.getElementById("notesContainer")
	const emptyState = document.getElementById("emptyState")

	if (deletedNotes.length === 0) {
		emptyState.style.display = "flex"
		notesContainer.style.display = "none"
	} else {
		emptyState.style.display = "none"
		notesContainer.style.display = "grid"
		notesContainer.innerHTML = deletedNotes.map(note => `
			<div class="note-card">
				<h3 class="note-title">${note.title}</h3>
				<p class="note-content">${note.content}</p>
				<div class="note-actions">
					<button class="edit-btn" onclick="moveToNotesPage('${note.id}')" title="Restore Note">
						<i class="fa-solid fa-arrows-rotate"></i>
					</button>
					<button class="edit-btn" onclick="openWarningDialog('${note.id}')" title="Permanently Delete">
						x
					</button>
				</div>
			</div>
		`).join("")
	}
}

// Restore note from trash
function moveToNotesPage(noteID) {
	const restoreNote = deletedNotes.find(note => note.id === noteID)
	
	// Remove from deleted notes
	deletedNotes = deletedNotes.filter(note => note.id !== noteID)
	
	// Add to main notes
	notes = [restoreNote, ...notes]
	
	saveDeletedNotes()
	saveNotes()
	
	// Update the correct view
	if (window.location.pathname.includes("deleted.html")) {
		renderDeletedNotes()
	} else {
		renderNotes()
	}
}

// Permanent deletion functions
function deletePermanently(noteID) {
	deletedNotes = deletedNotes.filter(note => note.id !== noteID)
	saveDeletedNotes()
	renderDeletedNotes()
}

function openWarningDialog(noteID) {
	currentlyDeletingNote = noteID
	const dialog = document.getElementById("warningDialog")
	dialog.showModal()
}

function closeWarningDialog() {
	currentlyDeletingNote = null
	const dialog = document.getElementById("warningDialog")
	dialog.close()
}

// ==================== INITIALIZATION ====================
document.addEventListener("DOMContentLoaded", () => {
	// Load all notes
	notes = loadNotes()
	deletedNotes = loadDeletedNotes()

	// Determine current page
	const isDeletedPage = window.location.pathname.includes("deleted.html")
	
	if (isDeletedPage) {
		renderDeletedNotes()
	} else {
		renderNotes()
		// Add submit handler only on main page
		document.getElementById("noteDialog").addEventListener("submit", saveNote)
	}
})