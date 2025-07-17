import "./styles.css";
import React from 'react';

const StartPage = () => {
  return (
    <div className="startPage-container">
      <div className="startPage-content">
        <div className="startPage-buttons">
        <a href="/Login" class="startpage-buttons">
        <button class="startpage-buttons" type="button">Get started</button>
        </a>
        </div>
      </div>
    </div>
  );
};

export default StartPage;

