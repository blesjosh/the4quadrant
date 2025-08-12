"use server";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { supabase } from "../../../lib/supabase"; // Use the cleaner path alias

// Define the TaskData interface for type safety
interface TaskData {
  title: string;
  description: string;
  deadline?: Date;
  delegated_to: string; // Changed from delegatedTo to match the database column name
}

export async function fetchTasks() {
  const { userId } = await auth();
  if (!userId) {
    return [];
  }

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Supabase fetch error:", error.message);
  }

  return data || [];
}

export async function createTask(taskData: TaskData) {
  try {
    console.log("Starting task creation with data:", taskData);
    
    // Check authentication
    const { userId } = await auth();
    if (!userId) {
      console.error("Authentication failed: No user ID");
      throw new Error("You must be logged in to create a task.");
    }
    
    console.log("User authenticated with ID:", userId);

    // Create the task object
    const newTask = {
      title: taskData.title,
      description: taskData.description,
      deadline: taskData.deadline,
      delegated_to: taskData.delegated_to, // Changed from delegatedTo to match the database column
      status: 'unallocated',
      user_id: userId,
      created_at: new Date().toISOString(),
    };
    
    console.log("Attempting to insert task into Supabase:", newTask);

    // Insert the task into Supabase and return the created task
    const { data, error } = await supabase
      .from("tasks")
      .insert(newTask)
      .select()
      .single(); // This returns the created object

    if (error) {
      console.error("Supabase insertion error:", error);
      throw new Error(`Failed to create task: ${error.message}`);
    }
    
    console.log("Task created successfully:", data);

    // Revalidate the dashboard page to show the new task
    revalidatePath("/dashboard");
    return data; // Return the new task data
  } catch (error: any) {
    console.error("Task creation failed:", error);
    return { error: error.message }; // Return an error object
  }
}

export async function updateTaskStatus(
  taskId: number,
  newStatus: string
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("You must be logged in to update a task.");
  }

  // Update the task in the 'tasks' table
  const { error } = await supabase
    .from("tasks")
    .update({ status: newStatus })
    .eq("id", taskId) // for the specific task
    .eq("user_id", userId); // AND for the logged-in user (SECURITY)

  if (error) {
    console.error("Supabase Update Error:", error);
    throw new Error("Failed to update task status.");
  }

  // Refresh the data on the dashboard page
  revalidatePath("/dashboard");
}

export async function completeTask(taskId: number, currentStatus: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not logged in");

  const { error } = await supabase
    .from("tasks")
    .update({ 
      status: 'completed', 
      last_active_status: currentStatus // Save where the task came from
    })
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw new Error("Failed to complete task.");
  revalidatePath("/dashboard");
}

export async function undoTask(taskId: number, previousStatus: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not logged in");

  // Move the task back to its last active status
  const { error } = await supabase
    .from("tasks")
    .update({ status: previousStatus, last_active_status: null }) // Clear the last status
    .eq("id", taskId)
    .eq("user_id", userId);

  if (error) throw new Error("Failed to undo task.");
  revalidatePath("/dashboard");
}

export async function deleteTask(taskId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error("Not logged in");

  const { error } = await supabase
    .from("tasks")
    .delete() // Delete the row
    .eq("id", taskId)
    .eq("user_id", userId); // Security check

  if (error) throw new Error("Failed to delete task.");
  revalidatePath("/dashboard");
}